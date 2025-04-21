const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
let signer;
let contract;

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update with your deployed contract address

const abi = [
    "function registerBeneficiary(address _beneficiary) public",
    "function grantAid(address recipient, uint256 amount) public",
    "function checkAidBalance(address _user) public view returns (uint256)"
];

// ✅ Connect to Ethereum Wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = web3Provider.getSigner();
            contract = new ethers.Contract(contractAddress, abi, signer);
            alert("✅ Wallet connected successfully!");
        } catch (error) {
            console.error("❌ Wallet connection error:", error);
            alert("❌ Error connecting to wallet");
        }
    } else {
        alert("⚠️ Please install MetaMask!");
    }
}

// ✅ Register Beneficiary
async function registerBeneficiary() {
    const address = document.getElementById("register-address").value;
    if (!address) {
        alert("⚠️ Please enter a valid Ethereum address.");
        return;
    }

    try {
        const tx = await contract.registerBeneficiary(address);
        await tx.wait();
        alert("✅ Beneficiary registered successfully!");
    } catch (error) {
        console.error("❌ Error registering beneficiary:", error);
        alert("❌ Error registering beneficiary");
    }
}

// ✅ Grant Aid using AI Prediction
async function grantAid() {
    const recipient = document.getElementById("recipient").value;
    const amountInput = document.getElementById("amount");

    // 🔴 Collect input values for AI prediction
    const region = document.getElementById("region").value;
    const previousAid = document.getElementById("previous-aid").value;
    const incomeLevel = document.getElementById("income-level").value;
    const populationAffected = document.getElementById("population-affected").value;
    const crisisSeverity = document.getElementById("crisis-severity").value;
    const requestedAid = document.getElementById("requested-aid").value;

    if (!recipient || !region || !previousAid || !incomeLevel || !populationAffected || !crisisSeverity || !requestedAid) {
        alert("⚠️ Please fill all the required fields.");
        return;
    }

    try {
        // 1️⃣ Send data to AI Model for prediction
        const response = await fetch("http://127.0.0.1:5000/predict-aid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                region: parseFloat(region),
                previous_aid: parseFloat(previousAid),
                income_level: parseFloat(incomeLevel),
                population_affected: parseFloat(populationAffected),
                crisis_severity: parseFloat(crisisSeverity),
                requested_aid: parseFloat(requestedAid)
            })
        });

        // ❗ Check if server responded with an error
        if (!response.ok) {
            const errorText = await response.text();
            alert("❌ Server error: " + errorText);
            return;
        }

        const data = await response.json();
        const predictedAmount = data.predicted_aid;

        // ❗ Ensure valid prediction
        if (!predictedAmount || isNaN(predictedAmount)) {
            alert("❌ Invalid prediction from AI model.");
            return;
        }

        // 2️⃣ Display prediction in UI
        amountInput.value = predictedAmount;

        // 3️⃣ Grant aid on blockchain
        const tx = await contract.grantAid(recipient, ethers.utils.parseEther(predictedAmount.toString()));
        await tx.wait();
        alert(`✅ Aid granted: ${predictedAmount} ETH`);
    } catch (error) {
        console.error("❌ Error granting aid:", error);
        alert("❌ Error granting aid");
    }
}

// ✅ Check Aid Balance
async function checkAid() {
    const userId = document.getElementById("user-id").value;
    if (!userId) {
        alert("⚠️ Please enter your user ID.");
        return;
    }

    try {
        const aidReceived = await contract.checkAidBalance(userId);
        document.getElementById("aid-balance").innerText = `Aid Received: ${ethers.utils.formatEther(aidReceived)} ETH`;
    } catch (error) {
        console.error("❌ Error fetching aid balance:", error);
        alert("❌ Error fetching aid balance");
    }
}

