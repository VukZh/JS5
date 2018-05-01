function CustomError(err) {
    this.name = 'MyError';
    this.message = err.message;
    this.stack = err.stack;
}

process.on('uncaughtException', function(err) {
    try {
        throw new CustomError(err);
    } catch (e) {
        console.log('name:', e.name);
        console.log('message:', e.message);
        console.log('stack:', e.stack);
    }
});

funC();