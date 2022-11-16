// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract StorageContract {
    struct File {
        uint256 fileID;
        address fileOwner;
        string fileName;
        string fileHash;
    }

    uint256 public fileID = 0;
    mapping(uint256 => File) public fileStorage;

    function addFile(
        string memory _fileName,
        string memory _fileHash,
        address owner
    ) public returns (bool status) {
        fileID += 1;
        address _fileOwner = owner;
        File memory newFile = File(fileID, _fileOwner, _fileName, _fileHash);
        fileStorage[fileID] = newFile;

        return true;
    }

    function getFile(uint256 _fileID)
        public
        view
        returns (
            uint256,
            address,
            string memory,
            string memory
        )
    {
        File memory file = fileStorage[_fileID];
        return (file.fileID, file.fileOwner, file.fileName, file.fileHash);
    }
}
