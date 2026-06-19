import { LOG_SUBTYPES } from "../care/config";

export const SPECIES = [
    { id: "dog", name: "pet.species.dog", hasBreed: true, icon: "🐶", prefersKg: true },
    { id: "cat", name: "pet.species.cat", hasBreed: true, icon: "🐱", prefersKg: true },
    { id: "smallMammal", name: "pet.species.smallMammal", hasBreed: false, icon: "🐹", prefersKg: false },
    { id: "bird", name: "pet.species.bird", hasBreed: false, icon: "🐦", prefersKg: false },
    { id: "fish", name: "pet.species.fish", hasBreed: false, icon: "🐠", prefersKg: false },
    { id: "reptile", name: "pet.species.reptile", hasBreed: false, icon: "🦎", prefersKg: false },
    { id: "amphibian", name: "pet.species.amphibian", hasBreed: false, icon: "🐸", prefersKg: false },
] as const;

export const dogBreeds = [
    { id: "akita", label: "pet.breeds.dog.akita" },
    { id: "amstaff", label: "pet.breeds.dog.amstaff" },
    { id: "australianShepherd", label: "pet.breeds.dog.australianShepherd" },
    { id: "basset", label: "pet.breeds.dog.basset" },
    { id: "beagle", label: "pet.breeds.dog.beagle" },
    { id: "bernese", label: "pet.breeds.dog.bernese" },
    { id: "bichon", label: "pet.breeds.dog.bichon" },
    { id: "borderCollie", label: "pet.breeds.dog.borderCollie" },
    { id: "bostonTerrier", label: "pet.breeds.dog.bostonTerrier" },
    { id: "boxer", label: "pet.breeds.dog.boxer" },
    { id: "brittany", label: "pet.breeds.dog.brittany" },
    { id: "bulldog", label: "pet.breeds.dog.bulldog" },
    { id: "canaryMastiff", label: "pet.breeds.dog.canaryMastiff" },
    { id: "caneCorso", label: "pet.breeds.dog.caneCorso" },
    { id: "kingCharles", label: "pet.breeds.dog.kingCharles" },
    { id: "chihuahua", label: "pet.breeds.dog.chihuahua" },
    { id: "cocker", label: "pet.breeds.dog.cocker" },
    { id: "collie", label: "pet.breeds.dog.collie" },
    { id: "dachshund", label: "pet.breeds.dog.dachshund" },
    { id: "doberman", label: "pet.breeds.dog.doberman" },
    { id: "englishSetter", label: "pet.breeds.dog.englishSetter" },
    { id: "englishSpringer", label: "pet.breeds.dog.englishSpringer" },
    { id: "frenchBulldog", label: "pet.breeds.dog.frenchBulldog" },
    { id: "germanShepherd", label: "pet.breeds.dog.germanShepherd" },
    { id: "germanShorthaired", label: "pet.breeds.dog.germanShorthaired" },
    { id: "goldenRetriever", label: "pet.breeds.dog.goldenRetriever" },
    { id: "greatDane", label: "pet.breeds.dog.greatDane" },
    { id: "havanese", label: "pet.breeds.dog.havanese" },
    { id: "irishSetter", label: "pet.breeds.dog.irishSetter" },
    { id: "jackRussell", label: "pet.breeds.dog.jackRussell" },
    { id: "labrador", label: "pet.breeds.dog.labrador" },
    { id: "maltese", label: "pet.breeds.dog.maltese" },
    { id: "mastiff", label: "pet.breeds.dog.mastiff" },
    { id: "schnauzer", label: "pet.breeds.dog.schnauzer" },
    { id: "mixed", label: "pet.breeds.dog.mixed" },
    { id: "newfoundland", label: "pet.breeds.dog.newfoundland" },
    { id: "corgi", label: "pet.breeds.dog.corgi" },
    { id: "pitbull", label: "pet.breeds.dog.pitbull" },
    { id: "pomeranian", label: "pet.breeds.dog.pomeranian" },
    { id: "poodle", label: "pet.breeds.dog.poodle" },
    { id: "pug", label: "pet.breeds.dog.pug" },
    { id: "rottweiler", label: "pet.breeds.dog.rottweiler" },
    { id: "samoyed", label: "pet.breeds.dog.samoyed" },
    { id: "shetland", label: "pet.breeds.dog.shetland" },
    { id: "shibaInu", label: "pet.breeds.dog.shibaInu" },
    { id: "shihTzu", label: "pet.breeds.dog.shihTzu" },
    { id: "husky", label: "pet.breeds.dog.husky" },
    { id: "staffie", label: "pet.breeds.dog.staffie" },
    { id: "vizsla", label: "pet.breeds.dog.vizsla" },
    { id: "weimaraner", label: "pet.breeds.dog.weimaraner" },
    { id: "yorkshire", label: "pet.breeds.dog.yorkshire" },
    { id: "unknown", label: "pet.breeds.unknown" },
];

export const catBreeds = [
    { id: "abyssinian", label: "pet.breeds.cat.abyssinian" },
    { id: "bengal", label: "pet.breeds.cat.bengal" },
    { id: "birman", label: "pet.breeds.cat.birman" },
    { id: "britishShorthair", label: "pet.breeds.cat.britishShorthair" },
    { id: "devonRex", label: "pet.breeds.cat.devonRex" },
    { id: "domesticLonghair", label: "pet.breeds.cat.domesticLonghair" },
    { id: "domesticShorthair", label: "pet.breeds.cat.domesticShorthair" },
    { id: "maineCoon", label: "pet.breeds.cat.maineCoon" },
    { id: "mixed", label: "pet.breeds.cat.mixed" },
    { id: "norwegianForestCat", label: "pet.breeds.cat.norwegianForestCat" },
    { id: "orientalShorthair", label: "pet.breeds.cat.orientalShorthair" },
    { id: "persian", label: "pet.breeds.cat.persian" },
    { id: "ragdoll", label: "pet.breeds.cat.ragdoll" },
    { id: "russianBlue", label: "pet.breeds.cat.russianBlue" },
    { id: "scottishFold", label: "pet.breeds.cat.scottishFold" },
    { id: "siamese", label: "pet.breeds.cat.siamese" },
    { id: "sphynx", label: "pet.breeds.cat.sphynx" },
    { id: "unknown", label: "pet.breeds.unknown" },
];

export const petFields = {
    name: {
        id: "pet-name",
        label: "pet.form.name",
    },
    species: {
        id: "pet-species",
        name: "pet-species",
        label: "pet.form.species",
        type: "radio",
        options: SPECIES,
    },
    breed: {
        id: "pet-breed",
        label: "pet.form.breed",
        placeholder: "pet.form.placeholderBreed",
    },
    birthDate: {
        id: "pet-birth",
        label: "pet.form.birthDate",
        type: "date",
    },
    sex: {
        id: "pet-sex",
        label: "pet.form.sex",
        options: [{ id: "male", label: "pet.sex.male" }, { id: "female", label: "pet.sex.female" }],
    },
    sterilized: {
        id: "pet-sterilized",
        label: "pet.form.sterilized",
    },
    microchipped: {
        id: "pet-microchipped",
        label: "pet.form.microchipped",
    }
};

export const logFields = {
    subtype: {
        label: "pet.form.logType",
        type: "radio",
        options: LOG_SUBTYPES,
    },
    date: {
        id: "log-date",
        label: "pet.form.date",
        type: "date",
    },
    notes: {
        id: "log-notes",
        label: "pet.form.notes",
        type: "text",
        placeholder: "pet.form.notesPlaceholder"
    },
} as const;