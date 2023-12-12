import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const usersAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      transformResponse: (responseData) => {
        return usersAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => [
        { type: "Users", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Users", id })),
      ],
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice;

//Returns the query result
export const usersResults = usersApiSlice.endpoints.getUsers.select();

//Creating a memoised selector
const selectUsersData = createSelector(usersResults, (results) => results.data);

//Using getSelectors to create
export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);
