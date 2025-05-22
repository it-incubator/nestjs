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

    // 4. Outside change that will conflict
    setTimeout(async () => {
        await changeValueInTrasaction('MIDDLE', 0)
    }, 100);

    let attemtps = 0;
    // 5. Transaction with automatic retry

    await changeValueInTrasaction('START')


    // 6. Final state
    console.log('😎 Final:', await Demo.findById(id));


    async function changeValueInTrasaction(newValue, delay = 200) {
        let attemtps = 0;
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            attemtps++;
            console.log(`🔄 attemtps for value ${newValue}: ${attemtps}`)
            const doc = await Demo.findById(id).session(session);
            console.log('🔍 [Txn] saw:', doc.value);

            // Simulate delay so that "outside" wins first
            await new Promise(r => setTimeout(r, delay));

            doc.value += `; transaction update ${newValue} `;
            console.log('✏️ [Txn] writing:', doc.value);
            await doc.save({ session }); // may throw WriteConflict
            console.log(`✅ [Txn] ${newValue} saved`);
        }, {
            // optional: total time to keep retrying before giving up
            maxCommitTimeMS: 5000
        });
        console.log('✅ Transaction committed for value ' + newValue);
    }
}



main().catch(console.error);
