export default {
    common: {
        button: {
            addChip: "Add",
            allChip: "All",
            scrollRight: "Scroll right",
            scrollLeft: "Scroll left",
        },
        panel: {
            hide: "Close form"
        },
        text: {
            noEventText: "You don't have any event scheduled.",
        },
        header: {
            greetings: "Welcome",
            calendar: "Calendar",
            vetH2: "Vet care",
            vetSpan: "Clinics, treatments & visits",
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
    addMenu: {
        pet: "Add pet",
        vetVisit: "Vet visit",
        vaccine: "New vaccine",
        vet: "Add vet"
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
        }
    },
    vet: {
        label: {
            phone: "Phone",
            hours: "Hours",
            email: "Email",
        },
        cta: {
            delete: "Delete {name}",
            call: "📞 Call",
            maps: "🗺️  Maps",
            visit: "Visit",
            email: "Email {name}",
            edit: "Edit {name}"
        },
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
                nextVetVisit: "Next vet visit",
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
            addVetVisit: "Add vet appointment",
            editVaccine: "Edit vaccine",
            editVetVisit: "Edit {name}'s vet appointment",
            addVet: "Add vet",
            editVet: "Edit {name}",
            myVets: "My vets",
        },
        cta: {
            saveVaccine: "Save vaccine",
            deleteVaccine: "Delete vaccine",
            saveVisit: "Save vet visit",
            deleteVisit: "Delete vet visit",
            saveVet: "Save {name}",
            deleteVet: "Delete vet"
        },
        vaccineForm: {
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
        vetVisitForm: {
            title: "Reason for visit",
            date: "Date",
            vet: "Vet",
            notes: "Notes",
            other: "Other",
            placeholderVet: "Type your vet's name...",
            chooseExisting: "Pick from my vets"
        },
        vetForm: {
            name: "Name",
            address1: "Address line 1",
            address2: "Address line 2",
            city: "Town/City",
            postCode: "Postcode",
            types: "Vet role(s)",
            assignedPets: "Assigned pet(s)",
            notes: "Notes",
            phone: "Phone number",
            email: "Email",
            hours: "Working hours"
        },
        stage: {
            adult: "Adult",
            young: "Young",
        },
        vetTypes: {
            primary: "Primary",
            secondary: "Secondary",
            emergency: "Emergency"
        },
    },
    events: {
        upcoming: "Upcoming",
        thisMonth: "This month",
        legend: "Legend",
        visits: "Visits",
        vaccines: "Vaccines"
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
                nameAdded: "{name} has been successfully added",
                nameUpdated: "{name} has been successfully updated",
                nameDeleted: "{name} has been successfully deleted",
                vaccineAdded: "{name}'s {type} successfully added",
                vaccineUpdated: "{name}'s {type} successfully updated",
                vaccineDeleted: "{name}'s {type} has been successfully deleted",
                visitAdded: "{name}'s {title} successfully added",
                visitUpdated: "{name}'s {title} successfully updated",
                visitDeleted: "{name}'s {title} has been successfully deleted",
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
        },
        deleteVetVisit: {
            title: "Delete {title} ?",
            message: "This will remove {name}'s {title}. This action cannot be undone. Are you sure you'd like to proceed?",
        },
        deleteVet: {
            title: "Delete {name} ?",
            message: "This will remove {name}'s contact information. This action cannot be undone. Are you sure you'd like to proceed?",
        },
    },
    tsToDate: {
        today: "Today",
        tomorrow: "Tomorrow",
        yesterday: "Yesterday",
        daysAgo: "{number} days ago",
        daysUntil: "in {number} days"
    }
};