import { useEffect } from "react";
import toast from "react-hot-toast";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

import {
  useDeleteUserMutation,
  useGetAdminUserQuery,
} from "../../redux/api/UserAPI";
import UserActions from "../adminActionBtn/UserActions";

const AllUser = () => {
  const { data, error, isLoading } = useGetAdminUserQuery();
  const [
    deleteUser,
    { error: deleteError, isLoading: deleteLoading, isSuccess: deleteSuccess },
  ] = useDeleteUserMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (deleteSuccess) {
      toast.success("User deleted");
    }
  }, [error, deleteError, deleteSuccess]);

  const setUsers = () => {
    const users = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    data?.users?.forEach((user) => {
      users.rows.push({
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        actions: (
          <>
            <div className="d-none d-lg-flex gap-2">
              <Link
                to={`/admin/users/${user?._id}`}
                className="btn btn-outline-primary"
              >
                <i className="fa fa-pencil"></i>
              </Link>
              <button
                className="btn btn-outline-danger ms-2"
                onClick={() => handleDeleteUser(user?._id)}
                disabled={deleteLoading}
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>
            <UserActions
              user={user}
              handleDeleteUser={handleDeleteUser}
              deleteLoading={deleteLoading}
              className="d-block d-lg-none"
            />
          </>
        ),
      });
    });

    return users;
  };

  const handleDeleteUser = (id) => {
    deleteUser(id);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title={"View Users"} />
      <AdminLayout>
        <div className="my-lg-5 my-2 text-center">
          <h1 className="text-2xl font-semibold">
            {data?.users?.length} Users
          </h1>
        </div>
        <div className="overflow-x-auto">
          <MDBDataTable
            className="min-w-[600px] md:min-w-full px-3"
            data={setUsers()}
            striped
            bordered
            hover
          />
        </div>
      </AdminLayout>
    </>
  );
};

export default AllUser;
