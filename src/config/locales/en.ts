export default {
    common: {
        button: {
            addLabel: "Add {label}",
            updateLabel: "Edit {label}",
            saveLabel: "save {label}",
        },
        panel: {
            hide: "Close form"
        },
        text: {
            noEventText: "You don't have any event scheduled."
        }
    },
    auth: {
        password: {
            show: "Show password",
            hide: "Hide password",
        },
        login: "Sign in",
        loginWithGoogle: "Login with Google",
        register: "Register",
        switchToLogin: "I already have an account",
        logOut: "Sign out"
    },
    userMenu: {
        logout: "Log out",
        updatePicture: "Update profile picture",
        updateName: "Edit name",
    },
    dashboard: {
        title: {
            petProfile: "{name}'s profile",
            petProfiles: "Pet profiles",
            upcoming: "Upcoming"
        }
    },
    calendar: {
        header: "Calendar",
    },
    pet: {
        title: {
            addFirstPet: "Your pet care starts here",
            addPet: "Add a pet",
            editPet: "Edit {name}",
        },
        addFirstPet: "You haven't added any pets yet.",
        cta: {
            save: "Save {name}",
            delete: "Delete {name}",
        },
        profile: {
            label: {
                sterilized: {
                    male: "Neutered",
                    female: "Spayed"
                },
                weight: "Weight",
                microchip: "Microchip",
                nextVaccine: "Next Vaccine",
                generalInformation: "general information",
            },
            edit: {
                weight: "update {name}'s weight",
                microchip: "edit {name}'s microchip",
                generalInformation: "edit {name}'s general information",
            }
        },
        form: {
            name: "Name",
            species: "Species",
            breed: "Breed",
            birthDate: "Birth date",
            sex: "Sex",
            sterilized: "Spayed / neutered",
            microchipped: "Microchipped",
            placeholderBreed: "Select breed..."
        },
        species: {
            dog: "Dog",
            cat: "Cat",
            smallMammal: "Small mammal",
            bird: "Bird",
            fish: "Fish",
            reptile: "Reptile",
            amphibian: "Amphibian"
        },
        sex: {
            male: "male",
            female: "female",
        },
    },
    health: {
        title: {
            addVaccine: "Add vaccine",
            editVaccine: "Edit vaccine",
        },
        cta: {
            save: "Save vaccine",
            delete: "Delete vaccine",
        },
        form: {
            types: "Vaccine",
            stage: "Stage",
            given: "{name} has already received this vaccine",
            givenDate: "Date given",
            nextDose: "Next dose scheduled?",
            dueDate: "Next due",
            vet: "Vet",
            notes: "Notes",
            validationTypes: "You must select a vaccine type",
        },
        stage: {
            adult: "Adult",
            young: "Young",
        }
    },
    toast: {
        dismiss: "Dismiss notification",
        success: {
            title: {
                generic: "Success",
                newUser: "Hi {name}!",
                loggedUser: "Welcome back!"
            },
            message: {
                userAuthenticated: "You have been successfully logged in.",
                petAdded: "{name} has been successfully added",
                petUpdated: "{name} has been successfully updated",
                petDeleted: "{name} has been successfully deleted",
                vaccineAdded: "{name}'s {type} successfully added",
                vaccineUpdated: "{name}'s {type} successfully updated",
                vaccineDeleted: "{name}'s {type} has been successfully deleted",
            },
        },
        error: {
            genericTitle: "Error",
            generic: "An unexpected error occurred",
        }
    },
    dialog: {
        common: {
            cancel: "Cancel",
            confirm: "Confirm",
        },
        deletePet: {
            title: "Delete {name} ?",
            message: "This will remove {name}'s profile and tracked information. This action cannot be undone. Are you sure you'd like to proceed?",
        },
        deleteVaccine: {
            title: "Delete {type} ?",
            message: "This will remove {name}'s {type}. This action cannot be undone. Are you sure you'd like to proceed?",
        }
    }
};