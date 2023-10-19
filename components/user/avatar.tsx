import { Icons } from "@/components/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "../ui/dialog";
import SignUpForm from "./signup-form";
import { useState, useEffect } from "react";
import { buttonVariants } from "../ui/button";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import SignInForm from "./signin-form";
import WatchlistPage from "./watchlist";

export default function UserAvatar() {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [openWatchList, setOpenWatchlist] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        setUserId(user.uid);
        setUserAvatar(user.photoURL);
      } else {
        setUserId(null);
        setUserAvatar(null);
      }
    });
  
    return () => unsubscribe();
  }, [auth]);

  function handleSignUpSubmit() {
    setOpenSignUp(false);
  }

  function handleSignInSubmit() {
    setOpenSignIn(false);
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  const user = auth.currentUser; 

  return (
    <div>
      <Dialog open={openSignUp} onOpenChange={setOpenSignUp}>
        <DialogContent>
          <SignUpForm onSubmit={handleSignUpSubmit} onSignInClick={() => { setOpenSignIn(true); setOpenSignUp(false); }} />
        </DialogContent>
      </Dialog>

      <Dialog open={openSignIn} onOpenChange={setOpenSignIn}>
        <DialogContent>
          <SignInForm onSubmit={handleSignInSubmit} onSignUpClick={() => { setOpenSignUp(true); setOpenSignIn(false); }} />
        </DialogContent>
      </Dialog>

      <Dialog open={openWatchList} onOpenChange={setOpenWatchlist}>
        <DialogContent className={"mt-2 max-h-screen overflow-y-scroll p-0 lg:max-w-screen-lg"}>
          {userId && <WatchlistPage userId={userId} />}
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className={buttonVariants({ size: "icon", variant: "ghost" })}>
            <Avatar className="h-6 w-6">
              <Icons.user className="h-6 w-6" />
              {userAvatar ? (
                <AvatarImage src={userAvatar} alt="User Avatar" />
              ) : (
                <AvatarFallback>
                  <Icons.user className="h-6 w-6" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuLabel>
            {isAuthenticated ? user?.email : ""} 
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isAuthenticated ? (
            <>
              <DropdownMenuItem onClick={() => setOpenWatchlist(true)}>Watchlist</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => setOpenSignIn(true)}>Sign in</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenSignUp(true)}>Sign up</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}