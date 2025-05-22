// index.js
require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
    // 1. Connect
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // 2. Define a simple schema WITHOUT versionKey interference
    const demoSchema = new mongoose.Schema(
        { value: String },
        { versionKey: false }
    );
    const Demo = mongoose.model('Demo', demoSchema);

    // 3. Create/reset our test document
    const demoId = new mongoose.Types.ObjectId();
    await Demo.deleteOne({ _id: demoId });
    await Demo.create({ _id: demoId, value: 'initial' });
    console.log('📝 Initial document:', await Demo.findById(demoId));

    // 4. Start Transaction A and read the document
    const session = await mongoose.startSession();
    session.startTransaction();
    const docA = await Demo.findById(demoId).session(session);
    console.log('🔍 [Txn A] read:', docA);

    // 5. Outside the transaction, read & modify the same document
    const docOutside = await Demo.findById(demoId);
    docOutside.value = 'outside update';
    await docOutside.save();
    console.log('✏️  [Outside] updated to:', docOutside);

    // 6. Back in Transaction A, modify & attempt to commit
    docA.value = 'transaction update';
    try{
        await docA.save({ session });
    }  catch(err) {
        console.error('🚸 [SAVE A] aborted due to conflict:', err.message);
    }// buffer this write in txn
    try {
        await session.commitTransaction();
        console.log('✅ [Txn A] committed successfully');
    } catch (err) {
        console.error('❌ [Txn A] aborted due to conflict:', err.message);
        await session.abortTransaction();
    } finally {
        session.endSession();
    }

    // 7. Show final state
    console.log('😎 Final document:', await Demo.findById(demoId));

    await mongoose.disconnect();
    console.log('✅ Disconnected');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
