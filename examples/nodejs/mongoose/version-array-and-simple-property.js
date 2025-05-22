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

    // 2. Define a schema with a comments array (default versionKey behavior)
    const postSchema = new mongoose.Schema({
        comments: [{ body: String }],
        status:   { type: String, enum: ['OPEN','CLOSED'], default: 'OPEN' }
    },
        {
            optimisticConcurrency: true // ☝️ важно без этого не будет версия сравниваться. изменение массива увеличило версию,
                // но последбюущий апдейт не массива не добавляет в where сравнение версия.
        }
        );
    // Note: no optimisticConcurrency here—showing default __v behavior on arrays
    const Post = mongoose.model('Post', postSchema);

    // 3. Create (or reset) a demo document
    const demoId = new mongoose.Types.ObjectId();
    await Post.deleteOne({ _id: demoId });
    const testPost = await Post.create({
        _id: demoId,
        comments: [
            { body: 'First comment' },
            { body: 'Second comment' },
            { body: 'Third comment' }
        ],
        status: 'OPEN'
    });
    console.log('📝 Test post created:', testPost);

    // 4. Simulate two “threads” loading the same doc
    const p1 = await Post.findById(demoId);
    const p2 = await Post.findById(demoId);

    // Thread A: remove the first comment
    p1.comments.splice(0, 1);
    await p1.save();    // __v: 0 → 1
    console.log('Thread A saved; comments now:', p1.comments.map(c => c.body));

    // Thread B: try to update the comment at index 1 (which no longer exists)
    p2.status = 'CLOSED';
    try {
        await p2.save();  // throws VersionError because __v is stale
    } catch (err) {
        console.error('❌ Thread B save failed:', err.message);
    }

    // 5. Show final document
    const finalDoc = await Post.findById(demoId);
    console.log('😎 Final post:', JSON.stringify(finalDoc, null, 2));

    await mongoose.disconnect();
    console.log('✅ Disconnected');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
