const { db } = require('../src/db/client');
const { users } = require('../src/db/schema');

async function createUser(name, email) {
    const user = await db.insert(users).values({ name, email }).returning();
    console.log('User created:', user);
}

async function getUser(id) {
    const user = await db.select().from(users).where(users.id.equals(id)).execute();
    console.log('User retrieved:', user);
}

async function updateUser(id, updates) {
    const user = await db.update(users).set(updates).where(users.id.equals(id)).returning();
    console.log('User updated:', user);
}

async function deleteUser(id) {
    const user = await db.delete(users).where(users.id.equals(id)).returning();
    console.log('User deleted:', user);
}

async function runCRUDOperations() {
    await createUser('John Doe', 'john@example.com');
    await getUser(1);
    await updateUser(1, { name: 'Jane Doe' });
    await deleteUser(1);
}

runCRUDOperations().catch(console.error);