#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");

// Get the directory of the current file
const dir = __dirname;

// Change to the directory
process.chdir(dir);

// Execute the Node.js script
exec("node swagger.js", (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Output:\n${stdout}`);
});
