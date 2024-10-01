import Profile from "../../components/ui/Profile";
import { useAuthContext } from "../../context/AuthContext";

function MyProfilePage() {
  const { user } = useAuthContext();

  if (!user) return;

  return <Profile ver="myProfile" user={user} />;
}

export default MyProfilePage;
