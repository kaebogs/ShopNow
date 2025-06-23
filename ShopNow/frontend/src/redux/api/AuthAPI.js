import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userApi } from "./UserAPI";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query(body){
        return {
          url: "/register",
          method: "POST",
          body,
        }
      },
        // This function runs when the mutation is initiated
      async onQueryStarted(args, {dispatch, queryFulfilled}){
        try {
          await queryFulfilled; // Wait for the registration request to complete
          
          // After successful registration, fetch the user data automatically
          await dispatch(userApi.endpoints.getUser.initiate(null));
        } catch (error) {
           console.log(error)
        }
      },
    }),
    login: builder.mutation({ //login
        query(body){
            return {
                url: "/login",
                method: "POST",
                body,
            }
        },
        // This function runs when the mutation is initiated
        async onQueryStarted(args, {dispatch, queryFulfilled}){
          try {
            await queryFulfilled; // Wait for the login request to complete
            await dispatch(userApi.endpoints.getUser.initiate(null));  // After successful login, fetch the user data automatically
          } catch (error) { 
             console.log(error)
          }
        },
    }),
    logout: builder.query({
      query: () => "/logout",    
    })
   
  }),
}); 

export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } = authApi;
