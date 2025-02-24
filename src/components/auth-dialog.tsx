"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Dispatch, SetStateAction, useState } from "react";
import SignInCard from "./shared/sign-in-card";
import SignUpCard from "./shared/sign-up-card";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const AuthDialog = ({
  showAuthDialog,
  setShowAuthDialog,
}: {
  showAuthDialog: boolean;
  setShowAuthDialog: Dispatch<SetStateAction<boolean>>;
}) => {
  const [currentAuthState, setCurrentAuthState] = useState("SIGNUP");

  return (
    <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="hidden"></AlertDialogTitle>
          <AlertDialogDescription className="hidden"></AlertDialogDescription>
          <div>
            <Button variant={"ghost"} onClick={() => setShowAuthDialog(false)}>
              <ArrowLeft />
            </Button>
            {currentAuthState === "SIGNUP" ? (
              <SignUpCard
                onAuthDialog={setShowAuthDialog}
                onAuthStateChange={(state: string) =>
                  setCurrentAuthState(state)
                }
              />
            ) : (
              <SignInCard
                onAuthDialog={setShowAuthDialog}
                onAuthStateChange={(state: string) =>
                  setCurrentAuthState(state)
                }
              />
            )}
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default AuthDialog;
