export default {
    common: {
        button: {
            addChip: "Añadir",
            allChip: "Todos",
            scrollRight: "Desplazar a la derecha",
            scrollLeft: "Desplazar a la izquierda",
        },
        panel: {
            hide: "Cerrar formulario"
        },
        text: {
            noEventText: "No tienes ningún evento programado.",
        },
        header: {
            greetings: "Bienvenida",
            calendar: "Calendario",
            vetH2: "Cuidados veterinarios",
            vetSpan: "Clínicas, tratamientos y visitas",
        }
    },
    auth: {
        password: {
            show: "Mostrar contraseña",
            hide: "Ocultar contraseña",
        },
        login: "Iniciar sesión",
        loginWithGoogle: "Iniciar sesión con Google",
        register: "Registrarse",
        switchToLogin: "Ya tengo una cuenta",
        logOut: "Cerrar sesión"
    },
    addMenu: {
        pet: "Añadir mascota",
        vetVisit: "Visita al veterinario",
        vaccine: "Nueva vacuna",
        vet: "Añadir veterinario"
    },
    userMenu: {
        logout: "Cerrar sesión",
        updatePicture: "Actualizar foto de perfil",
        updateName: "Editar nombre",
    },
    dashboard: {
        title: {
            petProfile: "Perfil de {name}",
            petProfiles: "Perfiles de mascotas",
        }
    },
    vet: {
        label: {
            phone: "Teléfono",
            hours: "Horario",
            email: "Correo electrónico",
        },
        notesPlaceholder: "Añade notas sobre este veterinario aquí…",
        addProfileLabel: {
            phone: "Añadir número de teléfono",
            hours: "Añadir horario de atención",
            email: "Añadir correo electrónico",
        },
        cta: {
            delete: "Eliminar {name}",
            call: "📞 Llamar",
            maps: "🗺️  Mapas",
            visit: "Visitar",
            email: "Escribir a {name}",
            edit: "Editar {name}",
            notes: "Añadir o editar notas",
            saveNotes: "Finalizar edición de notas"
        },
    },
    pet: {
        title: {
            addFirstPet: "El cuidado de tu mascota empieza aquí",
            addPet: "Añadir mascota",
            editPet: "Editar a {name}",
        },
        addFirstPet: "Todavía no has añadido ninguna mascota.",
        cta: {
            save: "Guardar {name}",
            delete: "Eliminar {name}",
        },
        profile: {
            label: {
                sterilized: {
                    male: "Castrado",
                    female: "Esterilizada"
                },
                weight: "Peso",
                microchip: "Microchip",
                nextVaccine: "Próxima vacuna",
                nextVetVisit: "Próxima visita al veterinario",
                generalInformation: "información general",
            },
            edit: {
                weight: "Actualizar el peso de {name}",
                microchip: "Editar el microchip de {name}",
                generalInformation: "Editar la información general de {name}",
                nextVaccine: "Editar o añadir próxima vacuna",
            }
        },
        form: {
            name: "Nombre",
            species: "Especie",
            breed: "Raza",
            birthDate: "Fecha de nacimiento",
            sex: "Sexo",
            sterilized: "Esterilizado / castrado",
            microchipped: "Con microchip",
            placeholderBreed: "Selecciona una raza..."
        },
        species: {
            dog: "Perro",
            cat: "Gato",
            smallMammal: "Pequeño mamífero",
            bird: "Ave",
            fish: "Pez",
            reptile: "Reptil",
            amphibian: "Anfibio"
        },
        sex: {
            male: "macho",
            female: "hembra",
        },
    },
    health: {
        title: {
            addVaccine: "Añadir vacuna",
            addVetVisit: "Añadir cita veterinaria",
            editVaccine: "Editar vacuna",
            editVetVisit: "Editar cita veterinaria de {name}",
            addVet: "Añadir veterinario",
            editVet: "Editar {name}",
            myVets: "Mis veterinarios",
        },
        cta: {
            saveVaccine: "Guardar vacuna",
            deleteVaccine: "Eliminar vacuna",
            saveVisit: "Guardar visita veterinaria",
            deleteVisit: "Eliminar visita veterinaria",
            saveVet: "Guardar {name}",
            deleteVet: "Eliminar veterinario"
        },
        vaccineForm: {
            types: "Vacuna",
            stage: "Etapa",
            given: "{name} ya ha recibido esta vacuna",
            givenDate: "Fecha de administración",
            nextDose: "¿Próxima dosis programada?",
            dueDate: "Próxima fecha",
            vet: "Veterinario",
            notes: "Notas",
            validationTypes: "Debes seleccionar un tipo de vacuna",
        },
        vetVisitForm: {
            title: "Motivo de la visita",
            date: "Fecha",
            vet: "Veterinario",
            notes: "Notas",
            other: "Otro",
            placeholderVet: "Escribe el nombre de tu veterinario...",
            chooseExisting: "Elegir de mis veterinarios"
        },
        vetForm: {
            name: "Nombre",
            address1: "Dirección (línea 1)",
            address2: "Dirección (línea 2)",
            city: "Ciudad",
            postCode: "Código postal",
            types: "Rol(es) del veterinario",
            assignedPets: "Mascota(s) asignada(s)",
            notes: "Notas",
            phone: "Número de teléfono",
            email: "Correo electrónico",
            hours: "Horario de atención"
        },
        stage: {
            adult: "Adulto",
            young: "Joven",
        },
        vetTypes: {
            primary: "Principal",
            secondary: "Secundario",
            emergency: "Urgencias"
        },
    },
    events: {
        upcoming: "Próximos",
        thisMonth: "Este mes",
        legend: "Leyenda",
        visits: "Visitas",
        vaccines: "Vacunas"
    },
    toast: {
        dismiss: "Cerrar notificación",
        success: {
            title: {
                generic: "Correcto",
                newUser: "Hola {name}!",
                loggedUser: "¡Bienvenida de nuevo!"
            },
            message: {
                userAuthenticated: "Has iniciado sesión correctamente.",
                nameAdded: "{name} se ha añadido correctamente",
                nameUpdated: "{name} se ha actualizado correctamente",
                nameDeleted: "{name} se ha eliminado correctamente",
                vaccineAdded: "Se ha añadido correctamente la vacuna {type} de {name}",
                vaccineUpdated: "Se ha actualizado correctamente la vacuna {type} de {name}",
                vaccineDeleted: "Se ha eliminado correctamente la vacuna {type} de {name}",
                visitAdded: "Se ha añadido correctamente la visita {title} de {name}",
                visitUpdated: "Se ha actualizado correctamente la visita {title} de {name}",
                visitDeleted: "Se ha eliminado correctamente la visita {title} de {name}",
            },
        },
        error: {
            genericTitle: "Error",
            generic: "Ha ocurrido un error inesperado",
        }
    },
    dialog: {
        common: {
            cancel: "Cancelar",
            confirm: "Confirmar",
        },
        deletePet: {
            title: "¿Eliminar a {name}?",
            message: "Esto eliminará el perfil de {name} y toda la información registrada. Esta acción no se puede deshacer. ¿Seguro que quieres continuar?",
        },
        deleteVaccine: {
            title: "¿Eliminar {type}?",
            message: "Esto eliminará la vacuna {type} de {name}. Esta acción no se puede deshacer. ¿Seguro que quieres continuar?",
        },
        deleteVetVisit: {
            title: "¿Eliminar {title}?",
            message: "Esto eliminará la visita {title} de {name}. Esta acción no se puede deshacer. ¿Seguro que quieres continuar?",
        },
        deleteVet: {
            title: "¿Eliminar {name}?",
            message: "Esto eliminará la información de contacto de {name}. Esta acción no se puede deshacer. ¿Seguro que quieres continuar?",
        },
    },
    tsToDate: {
        today: "Hoy",
        tomorrow: "Mañana",
        yesterday: "Ayer",
        daysAgo: "Hace {number} días",
        daysUntil: "Dentro de {number} días"
    }
};