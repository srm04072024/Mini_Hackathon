import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    goal: "",
    image: "",
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const response = await axios.get(
      "https://mini-hackathon-backend.onrender.com/api/campaigns"
    );
    setCampaigns(response.data);
  };

  const createCampaign = async () => {
    await axios.post(
      "https://mini-hackathon-backend.onrender.com/api/campaigns",
      newCampaign
    );
    setNewCampaign({ title: "", description: "", goal: "", image: "" });
    fetchCampaigns();
  };

  const donate = async (id, amount) => {
    await axios.post(
      `https://mini-hackathon-backend.onrender.com/api/campaigns/donate/${id}`,
      {
        amount,
      }
    );
    fetchCampaigns();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-3xl font-bold text-center">
          Needer and Helper Platform
        </h1>
      </header>

      <main className="p-4">
        {/* Create Campaign Section */}
        <section className="bg-white p-6 shadow-md rounded-lg mb-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Create a Campaign</h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 mb-3 border rounded-md"
            value={newCampaign.title}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, title: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 mb-3 border rounded-md"
            value={newCampaign.description}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Goal"
            className="w-full p-2 mb-3 border rounded-md"
            value={newCampaign.goal}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, goal: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Image URL"
            className="w-full p-2 mb-3 border rounded-md"
            value={newCampaign.image}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, image: e.target.value })
            }
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={createCampaign}
          >
            Create Campaign
          </button>
        </section>

        {/* Campaign List Section */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Available Campaigns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-white p-4 shadow-md rounded-lg"
              >
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
                <h3 className="text-xl font-semibold">{campaign.title}</h3>
                <p className="text-gray-600">{campaign.description}</p>
                <p className="text-gray-800 font-bold mt-2">
                  Goal: ${campaign.goal} | Raised: ${campaign.raised}
                </p>
                <button
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  onClick={() => donate(campaign._id, 10)}
                >
                  Donate $10
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
