const fs = require("fs");
const dotenv = require("dotenv").config();
const parser = require("body-parser");

const Web3 = require("web3");
const web3 = new Web3(process.env.BSC_PROVIDER);

const contractAbi = JSON.parse(fs.readFileSync("./abi/StorageContract.abi"));
const contract = new web3.eth.Contract(contractAbi, process.env.BSC_CONTRACT_ADDRESS)

const IPFS = require("ipfs-http-client");
const ipfs = new IPFS({host: "ipfs.infura.io", port: 5001, protocol: "https"})

const express = require("express");
const expressFileUpload = require("express-fileupload");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/static'));
app.use(expressFileUpload({ useTempFiles: true }));
app.use(parser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  if (req.method == "GET") {
    res.render("index")
  } else {
    res.render("bad_request")
  }
})


app.get("/get_file", (req, res) => {
  if (req.method == "GET") {
    res.render("get_file")
  } else {
    res.render("bad_request")
  }
})


app.get("/load_file_form", (req, res) => {
  if (req.method == "GET") {
    res.render("load_file")
  } else {
    res.render("bad_request")
  }
})


app.post("/load_file", (req, res) => {
  if (req.method == "POST") {
    let filename = req.body.filename;
    let file = req.files.file;
    let fileOwner = req.body.accountID;

    file.mv(file.tempFilePath, (err) => {
      if (err) {res.render("404")}
    });

    let fileContent = fs.readFileSync(file.tempFilePath);
    ipfs.add({filename : filename, content : fileContent}).then((response) => {
      let encodedMethod = contract.methods.addFile(filename, response.path, fileOwner).encodeABI();
      let transaction = {
        "to": process.env.BSC_CONTRACT_ADDRESS,
        "data": encodedMethod,
        "gas": 1500000
      }
  
      web3.eth.accounts.signTransaction(transaction, process.env.SIGNER_PRIVATE_KEY)
      .then((signed) => {
        web3.eth.sendSignedTransaction(signed.rawTransaction)
      })

      fs.unlinkSync(file.tempFilePath, (err) => {
        if (err) {
          res.render("404")
        }
      });
  
      res.redirect("/load_file_form")
    })
  } else {
    res.render("bad_request")
  }
})


const getOwnersFiles = async (ownerID) => {
  let fileNumber = await contract.methods.fileID().call();
  let ownersFiles = [];
  for (let i = 1; i <= fileNumber; i++) {
    let file = await contract.methods.fileStorage(i).call();
    if (ownerID === file.fileOwner) {
      ownersFiles.push(file);
    }
  }

  return ownersFiles;
} 


app.post("/file_info", async (req, res) => {
  if (req.method == "POST") {
    let fileOwner = req.body.owner.toString();
    await getOwnersFiles(fileOwner).then((ownersFiles) => {
      res.render("file_info", { ownersFiles })
    })
  } else {
    res.render("bad_request")
  }
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port -> ${PORT}`));