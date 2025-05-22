// tx-demo.js
require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
    // 1. Connect
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('✅ Connected');

    // 2. Simple schema, no versionKey needed here
    const schema = new mongoose.Schema({ value: String }, { versionKey: false });
    const Demo = mongoose.model('Demo', schema);

    // 3. Prep the test doc
    const id = new mongoose.Types.ObjectId();
    await Demo.deleteOne({ _id: id });
    await Demo.create({ _id: id, value: 'initial' });
    console.log('📝 Initial:', await Demo.findById(id));

    // 4. Outside change that will conflict AFTER 100ms
    setTimeout(() => changeValueInTransaction('MIDDLE', 0), 0);

    // 5. First transaction run manually
    await changeValueInTransaction('START', 200);

    // 6. Final state
    console.log('😎 Final:', await Demo.findById(id));
    await mongoose.disconnect();


    // -- helper with manual startTransaction / commitTransaction --
    async function changeValueInTransaction(newValue, delay = 200) {
        let attempts = 0;
        const session = await mongoose.startSession();

        try {
            await session.startTransaction();
            attempts++;
            console.log(`🔄 [${newValue}] attempt #${attempts}`);

            // Read under transaction
            const doc = await Demo.findById(id).session(session);
            console.log(`🔍 [${newValue}] saw:`, doc.value);

            // Wait so outside write can happen if delay > 0
            await new Promise(r => setTimeout(r, delay));

            // Mutate and save
            doc.value += `; transaction update ${newValue}`;
            console.log(`✏️  [${newValue}] writing:`, doc.value);
            await doc.save({ session });

            // Try to commit
            await session.commitTransaction();
            console.log(`✅ [${newValue}] committed`);
        } catch (err) {
            console.error(`❌ [${newValue}] transaction error:`, err.message);

            // Only abort if still in a transaction
            if (session.inTransaction()) {
                try {
                    await session.abortTransaction();
                    console.log(`⚠️  [${newValue}] aborted`);
                } catch (abortErr) {
                    console.error(`🚸 [${newValue}] abort failed:`, abortErr.message);
                }
            }
        } finally {
            session.endSession();
        }
    }
}

main().catch(console.error);
