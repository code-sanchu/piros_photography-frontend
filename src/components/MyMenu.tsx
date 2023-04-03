import { Fragment, type ReactElement } from "react";
import { Menu, Transition } from "@headlessui/react";

const MyMenu = ({
  button,
  items,
  styles,
}: {
  button: ReactElement;
  items: ReactElement;
  styles: {
    panel?: string;
  };
}) => {
  return (
    <Menu>
      <Menu.Button>{button}</Menu.Button>
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
          className={`absolute z-50 bg-white shadow-lg focus:outline-none ${
            styles.panel || ""
          }`}
        >
          {items}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MyMenu;
