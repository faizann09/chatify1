import User from "./User.jsx";
import userGetAllUsers from "../../context/userGetAllUsers";

export default function Users({ onUserSelect }) {
  const [allUsers, loading] = userGetAllUsers();

  // 👇 Gemini Bot static user
  const botUser = {
    _id: "gemini-bot",
    name: "🤖 Gemini Bot",
    email: "gemini@bot.ai",
  };

  return (
    <div className="py-1">
      {/* Always show bot user on top */}
      <User key="bot" user={botUser} onSelect={onUserSelect} />

      {/* Render real users */}
      {allUsers.map((user, index) => (
        <User key={index} user={user} onSelect={onUserSelect} />
      ))}
    </div>
  );
}



