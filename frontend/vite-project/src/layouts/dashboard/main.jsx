import SideNav from "./SideNav";
 
const DashboardLayout = () =>{
    return <>
    <Stack direction="row">
        {isDesktop && (
          // SideBar
          <SideNav />
        )}

        <Outlet />
      </Stack>
      </>
}

export default DashboardLayout;
