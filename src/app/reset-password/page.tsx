import RequireAuth from "@/features/auth/authN/components/RequireAuth";
import dynamic from "next/dynamic";
import LoadingPage from "../loading";
import ResetPasswordCustomAuthPage from "./ResetPasswordCustomAuthPage";
import ErrorPage from "../error";

const SendResetPasswordEmailPage = dynamic(
  () => import("./SendResetPasswordEmailPage"),
  { loading: () => <LoadingPage /> },
);

type SearchParams = Promise<{
  auth: "standard" | "custom";
}>;

export default async function ResetPasswordPageWrapper(props: {
  searchParams: SearchParams;
}) {
  const { auth = "standard" } = await props.searchParams;

  let content = <ErrorPage error={new Error("Page not found")} />;
  if (auth === "standard") {
    content = <SendResetPasswordEmailPage />;
  } else if (auth === "custom") {
    content = <ResetPasswordCustomAuthPage />;
  }

  return (
    <RequireAuth allowedRoles={[]} allowUnauthenticated>
      {content}
    </RequireAuth>
  );
}
