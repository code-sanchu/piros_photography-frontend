import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { List } from "phosphor-react";

const MainMenu = () => {
  return (
    <div className="fixed right-4 top-4">
      <Menu>
        <Menu.Button className="text-3xl">
          <List />
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
            className={`absolute right-0 z-50 origin-top-right rounded-md bg-white shadow-xl focus:outline-none`}
          >
            <div className="px-1 py-1">HELLO</div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default MainMenu;
