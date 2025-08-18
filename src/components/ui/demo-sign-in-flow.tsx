import { SignInPage } from "@/components/ui/sign-in-flow-1";

const DemoSignInFlow = () => {
  const handleEmailSubmit = (email: string) => {
    console.log("Email submitted:", email);
  };

  const handleCodeSubmit = (code: string) => {
    console.log("Code submitted:", code);
  };

  const handleSuccess = () => {
    console.log("Sign in successful");
    // 这里可以添加导航逻辑
  };

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <SignInPage 
        onEmailSubmit={handleEmailSubmit}
        onCodeSubmit={handleCodeSubmit}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export { DemoSignInFlow };
