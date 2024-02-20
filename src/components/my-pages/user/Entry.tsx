import { useEffect, type ReactElement } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Toast from "~/components/Toast";
import Header from "~/components/header/Entry";
import { Modal } from "~/components/modal";

const UserPage = () => {
  const session = useSession();

  const router = useRouter();

  useEffect(() => {
    if (!session.data) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.data]);

  return (
    <Layout>{!session.data ? <p>Redirecting...</p> : <ManageAccount />}</Layout>
  );
};

export default UserPage;

const Layout = ({ children }: { children: ReactElement | ReactElement[] }) => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <div className="mt-20 flex justify-center md:mt-28">
        <div className="w-full max-w-[1800px] p-4 xs:p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

const ManageAccount = () => {
  /*   const router = useRouter();
  const userId = router.query.id as string;

  const userQuery = api.user.userPageGetOne.useQuery({ userId }); */

  return (
    <div>
      <Account />
    </div>
  );
};

const Account = () => {
  const session = useSession();
  const sessionData = session.data as NonNullable<(typeof session)["data"]>;

  /*   const router = useRouter();
  const userId = router.query.id as string;
  const userQuery = api.user.userPageGetOne.useQuery(
    { userId },
    { enabled: false },
  ); */

  return (
    <div className="flex flex-col gap-2">
      {sessionData.user.name ? (
        <div className="flex gap-4">
          <p>Name:</p>
          <p>{sessionData.user.name}</p>
        </div>
      ) : null}
      {sessionData.user.email ? (
        <div className="flex gap-4">
          <p>Email:</p>
          <p>{sessionData.user.email}</p>
        </div>
      ) : null}
      <div className="mt-8">
        <DeleteAccountModal />
      </div>
    </div>
  );
};

const DeleteAccountModal = () => {
  const session = useSession();
  const sessionData = session.data as NonNullable<(typeof session)["data"]>;

  const deleteMutation = api.user.delete.useMutation({
    async onSuccess() {
      await signOut();

      toast(<Toast text="Deleted account" type="success" />);
    },
    onError: () => {
      toast(<Toast text="Error deleting account" type="error" />);
    },
  });

  return (
    <Modal
      button={({ openModal }) => (
        <button
          className="rounded-md border border-my-alert-content bg-my-alert py-1 px-3 text-my-alert-content"
          onClick={openModal}
          type="button"
        >
          Delete Account
        </button>
      )}
      panelContent={({ closeModal }) => (
        <div className="min-w-[300px] max-w-xl rounded-lg border bg-white p-4 shadow-lg">
          <h4>Delete account</h4>
          <p className="mt-4 text-sm text-gray-400">
            Delete your account permanently? All your comments and other user
            data will be deleted.
          </p>
          <div className="mt-8 flex  items-center justify-between">
            <button
              className="my-btn my-btn-neutral"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="my-btn my-btn-action"
              onClick={() => {
                deleteMutation.mutate({ userId: sessionData.user.id });
              }}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    />
  );
};

/* const UpdateName = () => {
  const updateNameMutation = api.user.updateName.useMutation({
    onSuccess() {
      toast(<Toast text="Updated name" type="success" />);
    },
    onError: () => {
      toast(<Toast text="Error updating name" type="error" />);
    },
  });

  return <div></div>;
};
 */
