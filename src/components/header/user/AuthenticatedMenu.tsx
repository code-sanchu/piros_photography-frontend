import { Fragment, type ReactElement } from "react";
import NextImage from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";

import WithTooltip from "~/components/WithTooltip";
import {
  SignOutIcon,
  UserCommentIcon,
  UserIcon,
  UserManageAccountIcon,
} from "~/components/icon";

// ! width of menu.items was collapsing for some reason - not fitting content - so hardcoded width.

const AuthenticatedMenu = () => {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button>
          <ButtonContent />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`absolute right-0 z-50 w-[350px] origin-top-right rounded-lg bg-white shadow-lg  focus:outline-none`}
          >
            <PanelContent />
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default AuthenticatedMenu;

const ButtonContent = () => {
  return (
    <WithTooltip text="my account">
      <div className="rounded-full border-4 border-transparent p-0.5 transition-colors duration-100 ease-in-out hover:border-4 hover:border-gray-100">
        <UserImage sideSize={30} />
      </div>
    </WithTooltip>
  );
};

const UserImage = ({ sideSize }: { sideSize: number }) => {
  const session = useSession();

  return session.data?.user.image ? (
    <NextImage
      className="rounded-full"
      alt=""
      src={session.data.user.image}
      width={sideSize}
      height={sideSize}
    />
  ) : (
    <div style={{ width: sideSize, height: sideSize }}>
      <UserIcon />
    </div>
  );
};

const PanelContent = () => {
  const session = useSession();
  const sessionData = session.data as NonNullable<(typeof session)["data"]>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <UserImage sideSize={34} />
        </div>
        <div>
          {sessionData.user.name ? <h3>{sessionData.user.name}</h3> : null}
          {sessionData.user.email ? (
            <p className="text-sm font-light text-gray-500">
              {sessionData.user.email}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 ml-[68px] flex flex-col gap-4">
        <MenuItem
          icon={<UserCommentIcon weight="light" />}
          text="My comments"
          onClick={() => null}
        />
        <MenuItem
          icon={<UserManageAccountIcon weight="light" />}
          text="Manage account"
          onClick={() => null}
        />
        <MenuItem
          icon={<SignOutIcon weight="light" />}
          text="Sign out"
          onClick={() => void signOut()}
        />
      </div>
    </div>
  );
};

const MenuItem = ({
  icon,
  text,
  onClick,
}: {
  icon: ReactElement;
  text: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex cursor-pointer items-center gap-7 rounded-lg py-1 px-4 hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="text-2xl text-gray-400">{icon}</div>
      <div className="text-sm font-light text-gray-500">{text}</div>
    </div>
  );
};
