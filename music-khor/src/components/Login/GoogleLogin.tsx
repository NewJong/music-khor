import { useState, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AvatarIcon } from "@radix-ui/react-icons";
import { navigate } from "astro:transitions/client";
import { fetchData } from "@/lib/fetchData";

export default function GoogleLogin() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const fetchUserData = async (email: string) => {
    try {
      const userData = await fetchData(`get-user?email=${email}`);
      setIsAdmin(userData?.isAdmin === 1);
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("../../lib/firebase")
        .then(({ auth }) => {
          if (auth.currentUser) {
            setUser(auth.currentUser);
            document.cookie = `e=${encodeURIComponent(auth.currentUser.email || "")}; path=/; max-age=31536000`;
            localStorage.setItem("userEmail", auth.currentUser.email || "");
            localStorage.setItem(
              "userDisplayName",
              auth.currentUser.displayName || ""
            );
            fetchUserData(auth.currentUser.email);
          }
          auth.onAuthStateChanged((user) => {
            setUser(user);
            if (user) {
              localStorage.setItem("userEmail", user.email || "");
              localStorage.setItem("userDisplayName", user.displayName || "");
              document.cookie = `e=${encodeURIComponent(user.email || "")}; path=/; max-age=31536000`;
              fetchUserData(user.email);
            } else {
              localStorage.removeItem("userEmail");
              localStorage.removeItem("userDisplayName");
              document.cookie =
                "e=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              setIsAdmin(false);
            }
          });
        })
        .catch((error) => {
          console.error("Firebase import error:", error);
        });
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { auth, provider, signInWithPopup } = await import(
        "../../lib/firebase"
      );
      if (auth.currentUser) return;

      const result = await signInWithPopup(
        auth,
        provider.setCustomParameters({
          prompt: "select_account",
        })
      );
      setUser(result.user);

      localStorage.setItem("userEmail", result.user.email || "");
      localStorage.setItem("userDisplayName", result.user.displayName || "");
      document.cookie = `e=${encodeURIComponent(result.user.email || "")}; path=/; max-age=31536000`;

      window.dispatchEvent(new Event("userEmailChanged"));

      const userData = {
        email: result.user.email,
        name: result.user.displayName,
      };

      await fetchData("add-user", "POST", userData);
      fetchUserData(result.user.email);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleSignOut = async () => {
    const { auth } = await import("../../lib/firebase");
    await auth.signOut();
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userDisplayName");
    setUser(null);
    setIsAdmin(false);
    document.cookie = "e=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.dispatchEvent(new Event("userEmailChanged"));
  };

  const handleSwitchAccount = async () => {
    await handleSignOut();
    await handleGoogleLogin();
  };

  return (
    <div className="flex items-center">
      {user ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center justify-center">
            <img
              src={user.photoURL || " "}
              alt="User avatar"
              className="w-12 h-12 rounded-full cursor-pointer border-gray-800 border-2 
         shadow-lg shadow-gray-800/50 transition-all hover:scale-110 flex-shrink-0 
         duration-300 ease-in-out hover:translate-y-[-2px]"
            />
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="bg-zinc-900 p-2 rounded-md shadow-lg mt-2 mr-4">
            <DropdownMenu.Label className="text-white px-2 py-1">
              {user.displayName}
              <br />
              {user.email}
            </DropdownMenu.Label>

            <DropdownMenu.Separator className="h-px bg-gray-500 my-1" />

            {isAdmin && (
              <DropdownMenu.Item
                className="text-white hover:bg-gray-700 rounded-md cursor-pointer px-2 py-1"
                onClick={() => navigate("/adminPanel")}
              >
                Admin Panel
              </DropdownMenu.Item>
            )}

            <DropdownMenu.Item
              className="text-white hover:bg-gray-700 rounded-md cursor-pointer px-2 py-1"
              onClick={handleSwitchAccount}
            >
              Change account
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-gray-500 my-1" />

            <DropdownMenu.Item
              className="text-white hover:bg-gray-700 rounded-md cursor-pointer px-2 py-1"
              onClick={handleSignOut}
            >
              Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : (
        <button
          onClick={handleGoogleLogin}
          className="rounded-full bg-zinc-900 text-white hover:bg-gray-500 shadow-lg shadow-gray-800/50 
          transition-all flex items-center justify-center w-12 h-12 transition duration-300 ease-in-out 
        hover:translate-y-[-2px]"
        >
          <AvatarIcon className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}
