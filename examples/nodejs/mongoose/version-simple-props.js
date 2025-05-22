// index.js
require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
    // 1. Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.set('debug', true);
    console.log('✅ Connected to MongoDB');

    // 2. Define a schema with optimisticConcurrency enabled
    const accountSchema = new mongoose.Schema({
        currentBalance: { type: Number, required: true },
        status:         { type: String, enum: ['PENDING','APPROVED'], default: 'PENDING' }
    },
        {
            optimisticConcurrency: true // ☝️ если false  - то при апдейте НЕ МАССИВА версия не меняется и не летит в where
                // если true - то вресия будет НЕ ДЛЯ МАССИВОВ тоже отслеживаться и инркементироваться
        });

    const Account = mongoose.model('Account', accountSchema);

    // 3. Create a test document (or reset it) for the demo
    const demoId = new mongoose.Types.ObjectId();
    // If you want a fixed ID, you can hard-code:
    // const demoId = mongoose.Types.ObjectId('64a1f2c3d4e5f6a7b8c9d0e1');
    await Account.deleteOne({ _id: demoId }); // clean slate
    const testAccount = await Account.create({
        _id: demoId,
        currentBalance: 10,
        status: 'PENDING'
    });
    console.log('📝 Test account created:', testAccount);

    // 4. Demo: two “threads” loading and saving the same document
    const a1 = await Account.findById(demoId);
    const a2 = await Account.findById(demoId);

    // Thread A bumps the balance
    a1.currentBalance += 50;
    await a1.save();     // succeeds, __v: 0 → 1
    console.log('Thread A saved, new balance:', a1.currentBalance);

    // Thread B now tries to set status
    a2.status = 'APPROVED';
    try {
        await a2.save();   // throws VersionError because __v is stale
    } catch (err) {
        console.error('❌ Thread B save failed:', err.message);
    }

    const resultDocument = await Account.findById(demoId);

    console.log('😎: ' + JSON.stringify(resultDocument, null, 2))

    await mongoose.disconnect();
    console.log('✅ Disconnected');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
