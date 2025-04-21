const { expect } = require("chai");

describe("AidDistribution", function () {
  let aidContract;
  let owner, donor, recipient;

  beforeEach(async function () {
    const Aid = await ethers.getContractFactory("AidDistribution");
    [owner, donor, recipient] = await ethers.getSigners();
    aidContract = await Aid.deploy();
    await aidContract.deployed();
  });

  it("should allow donations and track balances", async function () {
    await aidContract.connect(donor).donate({ value: ethers.utils.parseEther("1.0") });
    const balance = await aidContract.getBalance();
    expect(balance).to.equal(ethers.utils.parseEther("1.0"));
  });

  it("should allow admin to distribute aid", async function () {
    await aidContract.connect(donor).donate({ value: ethers.utils.parseEther("1.0") });
    await aidContract.distributeAid(recipient.address, ethers.utils.parseEther("0.5"));
    const recipientBalance = await ethers.provider.getBalance(recipient.address);
    expect(recipientBalance).to.be.above(0);
  });
});
