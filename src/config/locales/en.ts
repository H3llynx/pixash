
export default {
    common: {
        button: {
            cancel: "Cancel",
            confirm: "Confirm",
            save: "Save",
            edit: "Edit",
            clear: "Clear",
            back: "Back",
            next: "Next",
            add: "Add",
            allChip: "All",
            backDash: "Back to dashboard",
            backCal: "Back to calendar",
            markDone: "Mark as done"
        },
        panel: {
            hide: "Close form"
        },
        text: {
            noEventText: "You don't have any event scheduled.",
            noHistoryText: "You don't have any past event registered.",
            noPastTreatments: "{name} has no past medical treatment recorded.",
            noActiveTreatment: "{name} has no active medical treatments.",
            noWeightLog: "No weight log registered.",
            lastLogged: "Last logged",
            done: "Done!",
            antiparasiticLogged: "Antiparasitic against {parasites} logged for {name}.",
            addPicture: "Add a profile picture",
            copied: "Copied!",
            errorCopy: "Failed to copy",
        },
        header: {
            greetings: "Welcome",
            calendar: "Calendar",
            vetH2: "Vet care",
            vetSpan: "Clinics, treatments & visits",
            historyH2: "Health history",
            historySpan: "Medical records & stats per pet",
        },
        navbar: {
            home: "Home",
            calendar: "Calendar",
            vet: "Vet",
            history: "History",
            myPets: "My pets"
        },
        fileInputLabel: "Upload from your device."
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
        logOut: "Sign out",
        nameLabel: "How should we call you?",
        namePlaceholder: "Sasha's owner",
        emailLabel: "Email address",
        passwordLabel: "Password",
    },
    addMenu: {
        pet: "Add pet",
        vetVisit: "New vet visit",
        vaccine: "New vaccine",
        vet: "Add vet",
        log: "New log",
        antiparasitic: "Add antiparasitic",
        treatment: "Add treatment"
    },
    userMenu: {
        logout: "Log out",
        updatePicture: "Update profile picture",
        updateName: "Edit name",
    },
    dashboard: {
        title: {
            petProfile: "{name}'s profile",
            upcoming: "Upcoming",
            nextVaccine: "Next Vaccine",
            nextVetVisit: "Next vet visit",
            nextAntiparasitic: "Next antiparasitic",
            weightTracking: "Weight tracking",
            activeTreatments: "Active treatments",
            pastTreatments: "Past treatments"
        }
    },
    vet: {
        label: {
            phone: "Phone",
            hours: "Hours",
            email: "Email",
        },
        notesPlaceholder: "Add notes about this vet here…",
        addProfileLabel: {
            phone: "Add phone number",
            hours: "Add working hours",
            email: "Add email",
        },
        cta: {
            delete: "Delete {name}",
            call: "📞 Call",
            maps: "🗺️  Maps",
            visit: "Visit",
            email: "Email {name}",
            edit: "Edit {name}",
            notes: "Edit notes",
            saveNotes: "Stop editing notes"
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
            updatePic: "Update {name}'s picture"
        },
        profile: {
            labels: {
                sterilized: {
                    male: "Neutered",
                    female: "Spayed"
                },
                weight: "Weight",
                microchipped: "Microchipped",
                microchip: "Microchip",
                generalInformation: "General information",
                nextVaccine: "Next vaccine"
            },
            edit: {
                weight: "Log {name}'s weight",
                microchip: "Edit {name}'s microchip",
                generalInformation: "Edit {name}'s general information",
                nextVaccine: "Edit next vaccine",
            },
            addChip: "Add {name}'s microchip",
            insured: "Insured",
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
        insurance: {
            company: "Insurance company",
            policy: "Policy n°",
            contact: "Phone n°",
            web: "Website",
            update: "Update insurance information",
        }
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
            logAntiparasitic: "Log antiparasitic",
            addTreatment: "Add treatment",
            editTreatment: "Edit treatment"
        },
        cta: {
            saveVaccine: "Save vaccine",
            deleteVaccine: "Delete vaccine",
            saveVisit: "Save vet visit",
            deleteVisit: "Delete vet visit",
            saveVet: "Save {name}",
            deleteVet: "Delete vet",
            editVetVisit: "Edit vet appointment",
            logTreatment: "Log treatment",
            logWeight: "Log weight",
            editLog: "Edit log",
            startTreatment: "Start treatment",
            saveTreatment: "Save treatment",
            editTreatment: "Modify treatment",
            logDose: "Log dose",
            cancelLog: "Cancel log",
            editMedTime: "Update medication given time"
        },
        sharedFields: {
            givenDate: "Date given",
            nextDose: "Next dose scheduled?",
            dueDate: "Next due",
            notesPlaceholder: "Comments (optional)",
        },
        antiparasiteForm: {
            treated: "What did you treat?",
            notes: "Other information",
            validationTypes: "You must select what was treated",
            viewTitle: "Antiparasitic",
            notGiven: "{name} has not yet received this antiparasitic",
        },
        vaccineForm: {
            types: "Vaccine",
            stage: "Stage",
            given: "{name} has already received this vaccine",
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
        treatmentForm: {
            name: "Treatment name",
            startDate: "Start date",
            vet: "Prescribed by",
            notes: "Notes",
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
        treatment: {
            ongoing: "Ongoing treatment",
            started: "Started: ",
            until: "until ",
            ended: "ended: ",
            summaryLabel: "view log actions"
        },
        medicine: {
            title: "Medicine {index}",
            name: "Medicine name",
            instructions: "Medication instruction",
            frequency: {
                label: "Medication frequency",
                daily: "Daily",
                twiceDaily: "Twice daily",
                threeDaily: "Three times daily",
                every48: "Every 48h",
                custom: "Custom"
            },
            noEnd: "No end date",
            endDate: "End date",
            validationFrequency: "You must select a frequency",
            cta: "Add medicine",
            delete: "Delete medicine"
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
        parasites: {
            worms: "Intestinal worms",
            fleas: "Fleas",
            ticks: "Ticks",
            heartworms: "Heartworms",
            mites: "Mites",
            lice: "Lice",
            protozoa: "Protozoa",
            other: "Other treatment"
        },
    },
    events: {
        thisMonth: "This month",
        nextAntiparasitic: "Next antiparasitic due",
        legend: "Legend",
        visits: "Vet visits",
        vaccines: "Vaccines",
        antiparasitics: "Antiparasitics",
        weightLog: "Weight log"
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
                usernameUpdated: "Your name has successfully be changed to {name}",
                userPictureUpdated: "Your profile picture has been successfully updated",
                petPictureUpdated: "{name}'s picture has been successfully updated",
                nameAdded: "{name} has been successfully added",
                nameUpdated: "{name} has been successfully updated",
                nameDeleted: "{name} has been successfully deleted",
                vaccineAdded: "{name}'s {type} successfully added",
                vaccineUpdated: "{name}'s {type} successfully updated",
                visitAdded: "{name}'s {title} successfully added",
                visitUpdated: "{name}'s {title} successfully updated",
                treatmentAdded: "{name}'s {title} successfully added",
                treatmentUpdated: "{name}'s {title} successfully updated",
                eventDeleted: "{name}'s {title} has been successfully deleted",
                logDeleted: "{type} deleted",
                markedDone: "All set, this care task has been completed.",
                insuranceUpdated: "{name}'s insurance information successfully updated",
            },
        },
        error: {
            genericTitle: "Error",
            generic: "An unexpected error occurred",
            errorPicture: "Your picture could not be loaded. Please try again",
            errorFile: "Your document could not be loaded. Please try again",
        }
    },
    dialog: {
        deletePet: {
            title: "Delete {name} ?",
            message: "This will remove {name}'s profile and tracked information. This action cannot be undone. Are you sure you'd like to proceed?",
        },
        deleteEvent: {
            title: "Delete {title} ?",
            message: "This will remove {name}'s {title}. This action cannot be undone. Are you sure you'd like to proceed?",
        },
        deleteVet: {
            title: "Delete {name} ?",
            message: "This will remove {name}'s contact information. This action cannot be undone. Are you sure you'd like to proceed?",
        },
        deleteLog: {
            title: "Delete {type} ?",
            message: "This action cannot be undone. Are you sure you'd like to proceed?",
        },
        deletePicture: {
            title: "Delete picture ?",
            message: "This action cannot be undone. Are you sure you'd like to proceed?",
        },
    },
    tsToDate: {
        today: "Today",
        tomorrow: "Tomorrow",
        yesterday: "Yesterday",
        daysAgo: "{number} days ago",
        daysUntil: "in {number} days",
        monthsUntil: "in {number} month",
        monthsAgo: "{number} month ago",
    }
};