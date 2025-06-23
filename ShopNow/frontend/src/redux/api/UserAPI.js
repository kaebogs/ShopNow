import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../features/UserSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["User", "AdminUser"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/user",
      transformResponse: (result) => result.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("User API Response:", data);
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          console.log(error);
        }
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query(body) {
        return {
          url: "/user/updateProfile",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation({
      query(body) {
        return {
          url: "/user/upload_Avatar",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query(body) {
        return {
          url: "/password/update",
          method: "PUT",
          body,
        };
      },
    }),
    forgotPassword: builder.mutation({
      query(body) {
        return {
          url: "/password/forgot",
          method: "POST",
          body,
        };
      },
    }),
    resetPassword: builder.mutation({
      query({ token, body }) {
        return {
          url: `/password/reset/${token}`,
          method: "PUT",
          body,
        };
      },
    }),
    getAdminUser: builder.query({
      query: () => `/admin/users`,
      providesTags: ["AdminUser"],
    }),
    getUserDetails: builder.query({
      query: (id) => `/admin/users/${id}`,
      provideTags: ["AdminUser"],
    }),
    updateUser: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/users/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["AdminUser"]
    }),
    deleteUser: builder.mutation({
      query(id){
        return{
           url: `/admin/users/${id}`,
           method: "DELETE", 
        }
      },
      invalidatesTags: ["AdminUser"]
    })
  }),
});

export const {
  useGetUserQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAdminUserQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation
} = userApi;
