
# Shopping List App Pseudocode

Uses React, TypeScript, Redux Toolkit, React Router and json-server.
SECURITY NOTE:
Passwords are encrypted and decrypted.

## START PROGRAM

1. TYPES

TYPE User =
{
    id: string
    email: string
    passwordHash: string
    name: string
    surname: string
    cellNumber: string
}

TYPE ShoppingItem =
{
    id: string
    name: string
    quantity: number
    category: string
    imageUrl: string
    notes: string
    createdAt: string
}

TYPE ShoppingList =
{
    id: string
    ownerId: string
    name: string
    notes: string
    createdAt: string
    sharedToken: string
    items: ShoppingItem[]
}

TYPE AppState =
{
    auth:
    {
        currentUser: User OR null
        isLoggedIn: boolean
    }

    shoppingLists:
    {
        lists: ShoppingList[]
        loading: boolean
        error: string OR null
    }
}


2. JSON-SERVER API


SET API_URL = "http://localhost:5173"

FUNCTION getUsers()
    RETURN GET API_URL + "/users"
END FUNCTION

FUNCTION getUserByEmail(email)
    users = AWAIT getUsers()
    RETURN users.find(user => user.email == email)
END FUNCTION

FUNCTION createUser(user)
    RETURN POST API_URL + "/users" WITH user
END FUNCTION

FUNCTION updateUser(userId, updatedDetails)
    RETURN PATCH API_URL + "/users/" + userId WITH updatedDetails
END FUNCTION

FUNCTION getListsForUser(userId)
    RETURN GET API_URL + "/shoppingLists?ownerId=" + userId
END FUNCTION

FUNCTION createList(list)
    RETURN POST API_URL + "/shoppingLists" WITH list
END FUNCTION

FUNCTION updateList(listId, updatedList)
    RETURN PUT API_URL + "/shoppingLists/" + listId WITH updatedList
END FUNCTION

FUNCTION deleteList(listId)
    RETURN DELETE API_URL + "/shoppingLists/" + listId
END FUNCTION

FUNCTION findSharedList(token)
    RETURN GET API_URL + "/shoppingLists?sharedToken=" + token
END FUNCTION


FUNCTION addItemToList(list, item)
    list.items = list.items + item
    RETURN updateList(list.id, list)
END FUNCTION

FUNCTION updateItemInList(list, itemId, updatedItem)
    list.items = list.items.map(item =>
        IF item.id == itemId THEN updatedItem ELSE item
    )
    RETURN updateList(list.id, list)
END FUNCTION

FUNCTION deleteItemFromList(list, itemId)
    list.items = list.items.filter(item => item.id != itemId)
    RETURN updateList(list.id, list)
END FUNCTION



3. REDUX STATE AND ACTIONS

CREATE Redux store WITH:

    authSlice:
        currentUser = null
        isLoggedIn = false

        ACTION setLoggedInUser(user)
            currentUser = user
            isLoggedIn = true
        END ACTION

        ACTION logOut()
            currentUser = null
            isLoggedIn = false
        END ACTION

        ACTION updateCurrentUser(user)
            currentUser = user
        END ACTION
    END authSlice


    shoppingListsSlice:
        lists = []
        loading = false
        error = null

        ACTION setLists(lists)
            state.lists = lists
        END ACTION

        ACTION addList(list)
            state.lists.push(list)
        END ACTION

        ACTION replaceList(updatedList)
            Replace matching list in state.lists
        END ACTION

        ACTION removeList(listId)
            Remove matching list from state.lists
        END ACTION

        ACTION setLoading(value)
            state.loading = value
        END ACTION

        ACTION setError(message)
            state.error = message
        END ACTION
    END shoppingListsSlice

END STORE


4. AUTHENTICATION FUNCTIONS

FUNCTION register(email, password, name, surname, cellNumber)
    Check that all required fields are valid

    existingUser = AWAIT getUserByEmail(email)

    IF existingUser exists
        Show "Email is already registered"
        RETURN
    END IF

    passwordEncryption = Encrypt password

    newUser = {
        email,
        passwordHash,
        name,
        surname,
        cellNumber
    }

    AWAIT createUser(newUser)
    Show "Registration successful"
    Navigate to "/login"
END FUNCTION


FUNCTION login(email, password)
    user = AWAIT getUserByEmail(email)

    IF user exists AND VERIFY password AGAINST user.passwordEncrypted
        Save user session
        DISPATCH setLoggedInUser(user)
        Navigate to "/"
    ELSE
        Show "Email or password is incorrect"
    END IF
END FUNCTION


FUNCTION logOut()
    Clear saved user session
    DISPATCH logOut()
    Navigate to "/login"
END FUNCTION



5. REUSABLE COMPONENTS

COMPONENT Navigation
    Show links:
        Home
        Profile
        Log out button

    IF user is logged out
        Show Login and Register links
    END IF
END COMPONENT


COMPONENT ProtectedRoute(page)
    IF user is logged in
        SHOW page
    ELSE
        REDIRECT to "/login"
    END IF
END COMPONENT


COMPONENT SearchBar(searchText, onSearch)
    Show a labelled search field

    WHEN the field changes
        Call onSearch with the new value
    END WHEN
END COMPONENT


COMPONENT SortMenu(sortValue, onSort)
    Show sort options:
        Name
        Category
        Date added

    WHEN the selected option changes
        Call onSort with the selected value
    END WHEN
END COMPONENT


COMPONENT ShoppingItemCard(item, onEdit, onDelete, onShare onAdd)
    Show:
        Item image with descriptive alt text
        Item name
        Quantity
        Category
        Notes

    Show Edit, Delete, AddToCart, and Share buttons
END COMPONENT


COMPONENT ShoppingListCard(list, onEdit, onDelete, onAddItem)
    Show list name and notes
    Show each item using ShoppingItemCard
    Show buttons to add an item, edit the list and delete the list
END COMPONENT


COMPONENT AccessibleForm(fields, onSubmit)
    Give every field a visible label
    Show validation errors beside the related fields
    Make all controls keyboard accessible
    Show a clear focus indicator
    Submit form using onSubmit
END COMPONENT


6. PAGES

PAGE LoginPage
    Show email and password fields
    Show Login button
    Show link to Registration Page

    WHEN the user submits the form
        CALL login(email, password)
    END WHEN
END PAGE


PAGE RegistrationPage
    Show fields:
        Email
        Password
        Name
        Surname
        Cell number

    Show Register button
    Show link to Login Page

    WHEN the user submits the form
        CALL register(email, password, name, surname, cellNumber)
    END WHEN
END PAGE


PAGE HomePage
    WHEN page loads
        GET shopping lists for the logged-in user
        Save lists in Redux
    END WHEN

    Read "search" and "sort" from the URL

    Show:
        Navigation
        SearchBar
        SortMenu
        Add Shopping List button
        ShoppingListCard for each matching list

    WHEN the user searches for an item
        Put the keyword in the URL as "?search=keyword"
        Show items whose names contain the keyword
    END WHEN

    WHEN the URL search keyword changes
        Update the search field
        Update the displayed items
    END WHEN

    WHEN the user selects a sort option
        Put the option in the URL as "?sort=name"
        Sort items by name, category or date added
    END WHEN

    WHEN the URL contains a valid sort option
        Sort the displayed items using that option
    END WHEN

    WHEN the user selects "Add Shopping List"
        Show a form for list name and optional notes

        WHEN the form is submitted
            Create a list with:
                A new ID
                The logged-in user's ID
                The entered name and notes
                The current date
                An empty items array

            Save the list to json-server
            Add the list to Redux
        END WHEN
    END WHEN

    WHEN the user selects "Add Item"
        Show a form for:
            Item name
            Quantity
            Category
            Optional image URL
            Optional notes

        WHEN the form is submitted
            Create the item
            Save the updated list to json-server
            Update the list in Redux
        END WHEN
    END WHEN

    WHEN the user selects "Edit"
        Show the current list or item details in a form
        Save changes to json-server
        Update the list in Redux
    END WHEN

    WHEN the user selects "Delete"
        Ask the user to confirm
        IF confirmed
            Delete the list or item from json-server
            Update Redux
        END IF
    END WHEN

    WHEN the user selects "Share List"
        Create a unique sharing token
        Save the token on the list
        Show a link such as "/share/UNIQUE_TOKEN"
        Allow the user to copy the link
    END WHEN
END PAGE


PAGE ProfilePage
    Show the logged-in user's name, surname, email and cell number

    WHEN the user selects "Update Profile"
        Allow editing name, surname and cell number
        Save changes using updateUser()
        Update the user in Redux
    END WHEN

    WHEN the user selects "Update Login Details"
        Ask for current password and new login details
        Verify the current password
        Hash any new password
        Save the updated details using updateUser()
    END WHEN
END PAGE


PAGE SharedListPage(token)
    Find the list with the matching shared token

    IF the list exists
        Show its name and items in read-only mode
    ELSE
        Show "This shared list is unavailable"
    END IF
END PAGE


7. ROUTES AND APPLICATION START

SET UP routes:
    "/login"       → LoginPage
    "/register"    → RegistrationPage
    "/"            → ProtectedRoute(HomePage)
    "/profile"     → ProtectedRoute(ProfilePage)
    "/share/:token"→ SharedListPage

WHEN a logged-in user opens "/login" or "/register"
    Redirect to "/"
END WHEN

WHEN the application starts
    Load the saved user session
    IF a session exists
        Set the logged-in user in Redux
    END IF
    Show the page matching the current URL
END WHEN

## FINISH PROGRAM