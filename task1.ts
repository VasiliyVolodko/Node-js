process.stdin.on('data', data => {
    const output = data.toString().replace(/\s+/g, ' ').trim().split('').reverse().join('');
    process.stdout.write(output);
    process.stdout.write('\n\n');
});