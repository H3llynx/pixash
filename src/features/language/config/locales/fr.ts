export default {
    common: {
        button: {
            cancel: "Annuler",
            close: "Fermer",
            hide: "Masquer",
            confirm: "Confirmer",
            save: "Enregistrer",
            edit: "Modifier",
            clear: "Effacer",
            delete: "Supprimer",
            back: "Retour",
            next: "Suivant",
            add: "Ajouter",
            all: "Tous"
        },
        text: {
            genericError: "Une erreur est survenue. Veuillez réessayer.",
            noEventText: "Aucun soin à venir n’est programmé.",
            noHistoryText: "Aucun enregistrement trouvé pour la catégorie sélectionnée.",
            noPastTreatments: "Aucun traitement médical passé n’est enregistré.",
            noActiveTreatment: "Aucun traitement médical en cours.",
            noWeightLog: "Aucun relevé de poids enregistré.",
            lastLogged: "Dernier enregistrement",
            done: "C’est fait !",
            addPicture: "Ajouter une photo de profil",
            copied: "Copié !",
            errorCopy: "Échec de la copie",
            lastChecked: "dernier contrôle le {date}",
            timeline: "Chronologie",
            about: "À propos de Pixash"
        },
        header: {
            vetH2: "Soins vétérinaires",
            vetSpan: "Cliniques et traitements",
            historyH2: "Historique",
            historySpan: "Dossiers de santé et statistiques par animal",
            login: "Se connecter"
        },
        navbar: {
            home: "Accueil",
            calendar: "Calendrier",
            vet: "Vétérinaire",
            history: "Historique",
        },
        fileInputLabel: "Importer depuis votre appareil.",
        a11y: {
            petSelector: "Sélectionner un autre animal",
            petSelected: "{name} sélectionné(e)",
            allPetsSelected: "Tous les animaux sélectionnés",
            goToItem: "Aller à l’élément {item}",
        }
    },
    landing: {
        hero: {
            h1: "Tous les soins de votre animal au même endroit",
            h2: "Des soins pour votre animal, bien organisés",
            p: "Suivez les vaccins, les visites vétérinaires, les traitements, le poids et l’activité quotidienne.",
            cta: {
                openApp: "Ouvrir l’application",
                learnMore: "En savoir plus",
            },
            alt: {
                sasha: "Image d’un chien",
                pixie: "Image d’un chat",
                dashboard: "Image du tableau de bord"
            },
            bubbles: {
                pixie: "Mon prochain antiparasitaire est dans 16 jours.",
                sasha: "Quand est mon prochain vaccin ?"
            }
        },
        calendar: {
            h2: "Le calendrier de Pixie",
            h1: "Sachez ce qui arrive",
            p: "Consultez les vaccins, les visites vétérinaires et les antiparasitaires à venir dans un seul calendrier, puis retrouvez tout ce que vous avez enregistré.",
            li1: "Vue mensuelle, filtrée par animal",
            li2: "Consultez les soins à venir et les événements passés côte à côte",
            li3: "Enregistrez l’activité, le toilettage, le comportement et plus encore"
        },
        treatments: {
            h2: "Le traitement post-opératoire de Sasha",
            h1: "Visualisez précisément l’avancement du traitement",
            p: "Suivez les traitements et les médicaments au même endroit. Enregistrez chaque dose, visualisez la suite et repérez facilement les doses manquées.",
            li1: "Traitements en cours et programmés en un coup d’œil",
            li2: "Enregistrez une dose en un seul geste",
            li3: "Les doses manquées sont faciles à repérer"
        },
        features: {
            h1: "Tout ce dont votre animal a besoin, au même endroit",
            lump: {
                title: "Suivi des masses",
                description: "Photographiez une grosseur et contrôlez son évolution. Observez ses changements et partagez un historique clair avec votre vétérinaire."
            },
            weight: {
                title: "Suivi du poids",
                description: "Enregistrez le poids et suivez la tendance dans un graphique simple.",
                caption: "* Pixie a des notes."
            },
            insuranceChip: {
                title: "Assurance et puce",
                description: "Gardez les numéros de police et d’identification à portée de main, avec copie en un clic."
            },
            vets: {
                title: "Vos vétérinaires, toujours à portée de main",
                description: "Enregistrez les cliniques avec téléphone, e-mail, horaires et note d’urgence — associés au bon animal."
            },
            history: {
                title: "Un historique complet, par animal",
                description: "Filtrez par vaccins, visites vétérinaires, poids, antiparasitaires et autres événements. Chaque enregistrement est facile à retrouver."
            },
            multiPet: {
                title: "Conçu pour tous les animaux",
                description: "Créez un profil pour chaque animal et gardez ses soins, son historique et ses dossiers séparés."
            }
        },
        footer: "Conçu avec soin pour Sasha et Pixie"
    },
    auth: {
        password: {
            show: "Afficher le mot de passe",
            hide: "Masquer le mot de passe",
        },
        login: "Se connecter",
        loginWithGoogle: "Se connecter avec Google",
        register: "Créer un compte",
        switchToLogin: "J’ai déjà un compte",
        logOut: "Se déconnecter",
        nameLabel: "Comment souhaitez-vous que nous vous appelions ?",
        namePlaceholder: "Propriétaire de Sasha",
        emailLabel: "Adresse e-mail",
        passwordLabel: "Mot de passe",
        deleteAccount: {
            title: "Supprimer le compte",
            warning: "Cette action supprimera définitivement votre compte, ainsi que tous vos animaux, vétérinaires et dossiers de santé. Cette action est irréversible.",
            passwordLabel: "Confirmez votre mot de passe",
            cta: "Oui, supprimer mon compte",
            deleting: "Suppression…",
            wrongPassword: "Mot de passe incorrect. Veuillez réessayer.",
            popupClosed: "La connexion Google a été fermée avant d’être terminée. Veuillez réessayer.",
        }
    },
    addMenu: {
        pet: "Ajouter un animal",
        vetVisit: "Nouvelle visite vétérinaire",
        vaccine: "Enregistrer un vaccin",
        vet: "Ajouter un vétérinaire",
        log: "Nouvel enregistrement",
        antiparasitic: "Ajouter un antiparasitaire",
        treatment: "Ajouter un traitement",
        lump: "Ajouter une grosseur"
    },
    userMenu: {
        logout: "Se déconnecter",
        updatePicture: "Mettre à jour la photo de profil",
        updateName: "Modifier le nom",
        deleteAccount: "Supprimer le compte"
    },
    dashboard: {
        title: {
            petProfile: "Profil de {name}",
            upcoming: "À venir",
            nextVaccine: "Prochain vaccin",
            nextVetVisit: "Prochaine visite vétérinaire",
            nextAntiparasitic: "Prochain antiparasitaire",
            weightTracking: "Suivi du poids",
            activeTreatments: "Traitements en cours",
            lumpMonitoring: "Masses et grosseurs"
        }
    },
    vet: {
        label: {
            phone: "Téléphone",
            hours: "Horaires",
            email: "E-mail",
        },
        notesPlaceholder: "Ajoutez ici des notes sur ce vétérinaire…",
        addProfileLabel: {
            phone: "Ajouter un numéro de téléphone",
            hours: "Ajouter les horaires",
            email: "Ajouter une adresse e-mail",
        },
        cta: {
            delete: "Supprimer {name}",
            call: "📞 Appeler",
            maps: "🗺️ Itinéraire",
            visit: "Ajouter une visite",
            email: "Écrire à {name}",
            edit: "Modifier {name}",
            notes: "Modifier les notes",
            saveNotes: "Arrêter la modification des notes",
            moveEarlier: "Déplacer {name} plus tôt",
            moveLater: "Déplacer {name} plus tard"
        },
    },
    pet: {
        title: {
            addFirstPet: "Les soins de votre animal commencent ici",
            addPet: "Ajouter un animal",
            editPet: "Modifier {name}",
            log: "Enregistrer un soin",
            otherLog: "Enregistrement : {subtype}",
        },
        addFirstPet: "Vous n’avez pas encore ajouté d’animal.",
        cta: {
            save: "Enregistrer {name}",
            delete: "Supprimer {name}",
            updatePic: "Mettre à jour la photo de {name}",
            saveLog: "Enregistrer {subtype}",
        },
        profile: {
            labels: {
                sterilized: {
                    male: "Castré",
                    female: "Stérilisée"
                },
                weight: "Poids",
                microchipped: "Puce électronique",
                microchip: "Puce",
                generalInformation: "Informations générales",
                nextVaccine: "Prochain vaccin",
                insurance: "Assurance",
                insured: "Assuré(e)",
            },
            edit: {
                weight: "Enregistrer le poids de {name}",
                microchip: "Modifier la puce de {name}",
                generalInformation: "Modifier les informations générales de {name}",
                nextVaccine: "Modifier le prochain vaccin",
            },
            addChip: "Ajouter la puce de {name}",
            deleteChip: "Supprimer la puce de {name}"
        },
        form: {
            name: "Nom",
            species: "Espèce",
            breed: "Race",
            birthDate: "Date de naissance",
            sex: "Sexe",
            sterilized: "Stérilisé(e)",
            microchipped: "Pucé(e)",
            placeholderBreed: "Sélectionnez une race…",
            logType: "Soin / activité",
            date: "Date",
            notes: "Notes",
            notesPlaceholder: "Informations complémentaires (facultatif)",
        },
        species: {
            dog: "Chien",
            cat: "Chat",
            smallMammal: "Petit mammifère",
            bird: "Oiseau",
            fish: "Poisson",
            reptile: "Reptile",
            amphibian: "Amphibien"
        },
        breeds: {
            dog: {
                akita: "Akita",
                amstaff: "American Staffordshire Terrier",
                australianShepherd: "Berger australien",
                basset: "Basset Hound",
                beagle: "Beagle",
                bernese: "Bouvier bernois",
                bichon: "Bichon frisé",
                borderCollie: "Border Collie",
                bostonTerrier: "Boston Terrier",
                boxer: "Boxer",
                brittany: "Épagneul breton",
                bulldog: "Bulldog",
                canaryMastiff: "Mastiff des Canaries",
                caneCorso: "Cane Corso",
                kingCharles: "Cavalier King Charles Spaniel",
                chihuahua: "Chihuahua",
                cocker: "Cocker Spaniel",
                collie: "Collie",
                dachshund: "Teckel",
                doberman: "Dobermann",
                englishSetter: "Setter anglais",
                englishSpringer: "Springer anglais",
                frenchBulldog: "Bouledogue français",
                germanShepherd: "Berger allemand",
                germanShorthaired: "Braque allemand à poil court",
                goldenRetriever: "Golden Retriever",
                greatDane: "Dogue allemand",
                havanese: "Bichon havanais",
                irishSetter: "Setter irlandais",
                jackRussell: "Jack Russell Terrier",
                labrador: "Labrador Retriever",
                maltese: "Bichon maltais",
                mastiff: "Mastiff",
                schnauzer: "Schnauzer nain",
                newfoundland: "Terre-Neuve",
                corgi: "Welsh Corgi Pembroke",
                pitbull: "Pit Bull Terrier",
                pomeranian: "Spitz nain",
                poodle: "Caniche",
                pug: "Carlin",
                rottweiler: "Rottweiler",
                samoyed: "Samoyède",
                shetland: "Berger des Shetland",
                shibaInu: "Shiba Inu",
                shihTzu: "Shih Tzu",
                husky: "Husky sibérien",
                staffie: "Staffordshire Bull Terrier",
                vizsla: "Braque hongrois",
                weimaraner: "Braque de Weimar",
                yorkshire: "Yorkshire Terrier",
            },
            cat: {
                abyssinian: "Abyssin",
                bengal: "Bengal",
                birman: "Sacré de Birmanie",
                britishShorthair: "British Shorthair",
                devonRex: "Devon Rex",
                domesticLonghair: "Chat à poils longs",
                domesticShorthair: "Chat à poils courts",
                maineCoon: "Maine Coon",
                norwegianForestCat: "Norvégien",
                orientalShorthair: "Oriental",
                persian: "Persan",
                ragdoll: "Ragdoll",
                russianBlue: "Bleu russe",
                scottishFold: "Scottish Fold",
                siamese: "Siamois",
                sphynx: "Sphynx",
            },
            unknown: "Race inconnue",
            mixed: "Race croisée",
        },
        sex: {
            male: "mâle",
            female: "femelle",
        },
        insurance: {
            company: "Compagnie d’assurance",
            policy: "N° de police",
            contact: "Assistance sinistres",
            web: "Site web",
            update: "Détails de l’assurance",
        },
        logs: {
            feeding: "Alimentation",
            water: "Hydratation",
            cleaning: "Nettoyage",
            behavior: "Comportement",
            activity: "Activité",
            grooming: "Toilettage",
            reproduction: "Reproduction",
            other: "Autre",
        },
    },
    health: {
        title: {
            addVaccine: "Ajouter un vaccin",
            addVetVisit: "Ajouter une visite vétérinaire",
            editVaccine: "Modifier le vaccin",
            editVetVisit: "Modifier la visite de {name}",
            addVet: "Ajouter un vétérinaire",
            editVet: "Modifier {name}",
            myVets: "Mes vétérinaires",
            logAntiparasitic: "Enregistrer un antiparasitaire",
            addTreatment: "Ajouter un traitement",
            editTreatment: "Modifier le traitement"
        },
        cta: {
            saveVaccine: "Enregistrer le vaccin",
            saveVisit: "Enregistrer la visite",
            saveVet: "Enregistrer {name}",
            saveLump: "Enregistrer la grosseur",
            saveNextDose: "Enregistrer la prochaine dose",
            deleteVaccine: "Supprimer le vaccin",
            deleteVisit: "Supprimer la visite",
            deleteVet: "Supprimer le vétérinaire",
            deleteAntiparasitic: "Supprimer l’enregistrement d’antiparasitaire",
            logWeight: "Enregistrer le poids",
            logTreatment: "Enregistrer un traitement",
            startTreatment: "Commencer le traitement",
            saveTreatment: "Enregistrer le traitement",
            viewTreatment: "Voir le détail du traitement",
            deleteTreatment: "Supprimer le traitement",
            logDose: "Enregistrer une dose",
            editMedTime: "Modifier l’heure de prise du médicament",
            backDash: "Retour au tableau de bord",
            backCal: "Retour au calendrier",
            markDone: "Marquer comme fait",
        },
        sharedFields: {
            givenDate: "Date d’administration",
            nextDose: "Prochaine dose prévue ?",
            dueDate: "Prochaine date",
            notes: "Notes",
            notesPlaceholder: "Commentaires (facultatif)",
            photos: "Photos"
        },
        vaccines: {
            form: {
                types: "Vaccin",
                stage: "Stade",
                given: "{name} a déjà reçu ce vaccin",
                vet: "Vétérinaire",
                validationTypes: "Vous devez sélectionner un type de vaccin",
            },
            stage: {
                adult: "Adulte",
                young: "Jeune",
            },
            types: {
                rabies: "Rage",
                other: "Autres vaccins",
                dog: {
                    combo: "Vaccin combiné essentiel (DAPP)",
                    leish: "Leishmaniose"
                },
                cat: {
                    combo: "Vaccin combiné essentiel (FVRCP)",
                    felv: "Leucose féline (FeLV)",
                    fiv: "Immunodéficience féline (FIV)",
                },
                smallMammal: {
                    myxo: "Myxomatose + VHD",
                    distemper: "Maladie de Carré",
                },
            }
        },
        antiparasitics: {
            form: {
                treated: "Qu’avez-vous traité ?",
                notes: "Autres informations",
                validationTypes: "Vous devez sélectionner ce qui a été traité",
                viewTitle: "Antiparasitaire",
                notGiven: "{name} n’a pas encore reçu cet antiparasitaire"
            },
            logged: "Antiparasitaire contre {parasites} enregistré pour {name}.",
            types: {
                worms: "Vers intestinaux",
                fleas: "Puces",
                ticks: "Tiques",
                heartworms: "Vers du cœur",
                mites: "Acariens",
                lice: "Poux",
                protozoa: "Protozoaires",
                other: "Autre traitement"
            },
        },
        vet: {
            vetForm: {
                name: "Nom",
                address1: "Adresse (ligne 1)",
                address2: "Adresse (ligne 2)",
                city: "Ville",
                postCode: "Code postal",
                types: "Rôle(s) du vétérinaire",
                assignedPets: "Animaux associés",
                phone: "Numéro de téléphone",
                email: "E-mail",
                hours: "Horaires",
            },
            visitForm: {
                title: "Motif de la consultation",
                date: "Date",
                vet: "Vétérinaire",
                other: "Autre",
                placeholderVet: "Saisissez le nom de votre vétérinaire…",
                chooseExisting: "Choisir parmi mes vétérinaires"
            },
            types: {
                primary: "Vétérinaire principal",
                secondary: "Vétérinaire secondaire",
                emergency: "Urgences"
            },
        },
        treatment: {
            ongoing: "Traitement en cours",
            until: "jusqu’au ",
            ended: "terminé : ",
            summaryLabel: "voir les actions du journal",
            modalTitle: "Quand avez-vous donné {medication} à {name} ?",
            missedDoses: "Doses manquées",
            missedDoseToday: "Vous avez manqué une dose aujourd’hui",
            treatments: "Traitements",
            pastTreatments: "Traitements passés",
            scheduledTreatments: "Traitements programmés",
            viewMedLog: "Voir l’historique du journal",
            historyModal: {
                logged: "Enregistré",
                missed: "Manqué *",
                window: "Période en cours",
                beforeStart: "Avant la date de début",
                afterEnd: "Après la date de fin",
                bottomText: "Les enregistrements situés en dehors des dates actuelles du traitement sont conservés, mais signalés — modifiez-les ou supprimez-les ici s’ils ne s’appliquent plus.",
                bottomText2: "* N’inclut pas les doses du jour."
            },
            form: {
                name: "Nom du traitement",
                startDate: "Date de début",
                vet: "Prescrit par",
                medicine: {
                    title: "Médicament {index}",
                    name: "Nom du médicament",
                    instructions: "Instructions du médicament",
                    frequency: {
                        label: "Fréquence du médicament",
                        daily: "Une fois par jour",
                        twiceDaily: "Deux fois par jour",
                        threeDaily: "Trois fois par jour",
                        every48: "Toutes les 48 h",
                        custom: "Personnalisée"
                    },
                    noEnd: "Pas de date de fin",
                    endDate: "Date de fin",
                    validationFrequency: "Vous devez sélectionner une fréquence",
                    cta: "Ajouter un médicament",
                    delete: "Supprimer le médicament"
                }
            }
        },
        lumps: {
            form: {
                heading: "Ajouter une grosseur",
                title: "Titre",
                location: {
                    label: "Emplacement",
                    left: "Gauche",
                    right: "Droite"
                },
                size: "Taille",
                status: {
                    label: "Statut",
                    monitoring: "Suivi",
                    checked: "Vérifiée",
                    pending: "Analyses en attente",
                    removed: "Retirée",
                },
                bodyRegions: {
                    instructions: "Sélectionnez un emplacement sur le schéma",
                    snout: { left: "Museau gauche", right: "Museau droit" },
                    head: { left: "Tête gauche", right: "Tête droite" },
                    ear: { left: "Oreille gauche", right: "Oreille droite" },
                    neckCollar: { left: "Cou gauche", right: "Cou droit" },
                    shoulder: { left: "Épaule gauche", right: "Épaule droite" },
                    back: { left: "Dos gauche", right: "Dos droit" },
                    belly: { left: "Ventre gauche", right: "Ventre droit" },
                    flank: { left: "Flanc gauche", right: "Flanc droit" },
                    hip: { left: "Hanche gauche", right: "Hanche droite" },
                    frontLeg: { left: "Patte avant gauche", right: "Patte avant droite" },
                    hindLeg: { left: "Patte arrière gauche", right: "Patte arrière droite" },
                    tail: { left: "Queue gauche", right: "Queue droite" },
                }
            },
            trend: {
                up: "en croissance",
                down: "en diminution",
                stable: "stable",
            },
            currentSize: "taille actuelle",
            sinceFirstMeasured: "depuis la première mesure",
            checksLogged: "contrôles enregistrés",
            addCheck: "Ajouter un nouveau contrôle",
        },
        nextDueModal: {
            title: "Quand est prévue la prochaine dose ?",
            text: "Choisissez une date pour garder les soins de votre animal à jour.",
            skip: "Passer pour l’instant",
            dateOptions: {
                legend: "Choisissez une option pour définir automatiquement la date.",
                week: "1 semaine",
                month: "1 mois",
                month2: "2 mois",
                month3: "3 mois",
                month6: "6 mois",
                year: "1 an"
            }
        }
    },
    events: {
        thisMonth: "Ce mois-ci",
        nextAntiparasitic: "Prochain antiparasitaire",
        legend: "Légende",
        visits: "Consultations vétérinaires",
        vaccines: "Vaccins",
        antiparasitics: "Antiparasitaires",
        other: "Autres événements",
        weightLog: "Relevé de poids",
        eventTag: {
            vaccine: "Vaccin",
            visit: "Consultation",
            antiparasite: "Antiparasitaire",
            other: "Autre",
            weight: "Poids"
        }
    },
    toast: {
        dismiss: "Ignorer la notification",
        success: {
            title: {
                generic: "Succès",
                newUser: "Bonjour {name} !",
                loggedUser: "Bon retour !"
            },
            message: {
                userAuthenticated: "Vous êtes connecté(e) avec succès.",
                usernameUpdated: "Votre nom a bien été modifié en {name}",
                userPictureUpdated: "Votre photo de profil a bien été mise à jour",
                petPictureUpdated: "La photo de {name} a bien été mise à jour",
                nameAdded: "{name} a bien été ajouté(e)",
                nameUpdated: "{name} a bien été mis(e) à jour",
                nameDeleted: "{name} a bien été supprimé(e)",
                vaccineAdded: "Le vaccin {type} de {name} a bien été ajouté",
                vaccineUpdated: "Le vaccin {type} de {name} a bien été mis à jour",
                visitAdded: "La consultation « {title} » de {name} a bien été ajoutée",
                visitUpdated: "La consultation « {title} » de {name} a bien été mise à jour",
                treatmentAdded: "Le traitement « {title} » de {name} a bien été ajouté",
                treatmentUpdated: "Le traitement « {title} » de {name} a bien été mis à jour",
                logAdded: "L’enregistrement {subtype} de {name} a bien été ajouté",
                eventDeleted: "L’événement « {title} » de {name} a bien été supprimé",
                logDeleted: "Enregistrement supprimé",
                insuranceDeleted: "Informations d’assurance supprimées",
                markedDone: "C’est fait, ce soin a été marqué comme terminé.",
                insuranceUpdated: "Les informations d’assurance de {name} ont bien été mises à jour",
                lumpAdded: "La nouvelle grosseur de {name} a bien été enregistrée",
                lumpUpdated: "« {title} » a bien été mis(e) à jour",
                lumpDeleted: "« {title} » a bien été supprimé(e)",
            },
        },
        error: {
            genericTitle: "Erreur",
            errorPicture: "Votre photo n’a pas pu être importée. Veuillez réessayer.",
            errorFile: "Votre document n’a pas pu être importé. Veuillez réessayer.",
            errorDeletionPicture: "Votre photo n’a pas pu être supprimée. Veuillez réessayer."
        }
    },
    dialog: {
        deleteGenericMsg: "Cette action est irréversible. Voulez-vous vraiment continuer ?",
        deletePet: {
            title: "Supprimer {name} ?",
            message: "Cette action supprimera le profil de {name} et les informations suivies. Cette action est irréversible. Voulez-vous vraiment continuer ?",
        },
        deleteRecord: {
            title: "Supprimer l’enregistrement {title} de {name} ?",
        },
        deleteVisit: {
            title: "Supprimer la visite ?"
        },
        deleteVet: {
            title: "Supprimer {name} ?",
            message: "Cette action supprimera les coordonnées de {name}. Cette action est irréversible. Voulez-vous vraiment continuer ?",
        },
        deleteTreatment: {
            title: "Supprimer « {title} » ?",
            message: "Cette action supprimera définitivement le traitement {title} de {name}. Cette action est irréversible. Voulez-vous vraiment continuer ?",
        },
        deleteLump: {
            title: "Supprimer « {title} » ?",
        },
        deletePicture: {
            title: "Supprimer la photo ?",
        },
        deleteInsurance: {
            title: "Supprimer les informations d’assurance ?"
        }
    },
    tsToDate: {
        today: "Aujourd’hui",
        tomorrow: "Demain",
        yesterday: "Hier",
        daysAgo: "il y a {number} jours",
        daysUntil: "dans {number} jours",
        monthsUntil: "dans {number} mois",
        monthsAgo: "il y a {number} mois",
    }
};