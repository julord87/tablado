interface SeedTicketType {
  id: number;
  name: string;
  price: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SeedUsers {
  name: string;
  password: string;
  email: string;
}

interface SeedData {
  ticketTypes: SeedTicketType[];
  users?: SeedUsers[];
}

export const initialData: SeedData = {
  ticketTypes: [
    {
      id: 1,
      name: "Simple",
      price: 20.0,
      description: "Entrada con una bebida incluida",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Con tapa y bebida",
      price: 30.0,
      description: "Entrada con bebida y tapa incluida",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  users: [
    {
      name: "Julián",
      password: "0831",
      email: "julianmgtb@gmail.com",
    },
    {
      name: "Valeria",
      password: "1970",
      email: "valemar1970@gmil.com",
    },
  ],
};
