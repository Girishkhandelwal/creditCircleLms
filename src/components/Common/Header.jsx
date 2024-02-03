import { Navbar, IconButton, Button, Input } from "@material-tailwind/react";
  import { BellIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
   
  export default function Header() {
    return (
      <Navbar
        variant="gradient"
        color="blue-gray"
        className="mx-auto w-full rounded-[0%] mb-10 from-blue-gray-900 to-blue-gray-800 px-4 py-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
          
          <div className="ml-auto flex gap-1 md:mr-4">
            <IconButton variant="text" color="white">
              <Cog6ToothIcon className="h-5 w-5" />
            </IconButton>
            <IconButton variant="text" color="white">
              <BellIcon className="h-5 w-5" />
            </IconButton>
          </div>
          <div className="relative flex w-full gap-2 md:w-max">
            <Input
              type="search"
              color="white"
              label="Type here..."
              className="pr-20"
              containerProps={{
                className: "min-w-[288px]",
              }}
            />
            <Button
              size="sm"
              color="white"
              className="!absolute right-1 top-1 rounded"
            >
              Search
            </Button>
          </div>
        </div>
      </Navbar>
    );
  }