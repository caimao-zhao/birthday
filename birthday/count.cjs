const fs=require('fs'),vm=require('vm');let c={};vm.createContext(c);vm.runInContext(fs.readFileSync('birthday/memories.js','utf8')+';x=memories',c);console.log('02 photos:',x.length);
