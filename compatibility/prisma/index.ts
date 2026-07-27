class PrismaClient {
  public user = {
    findMany: async () => [{ id: 1, email: "rahul@example.com" }],
  };
}

const prisma = new PrismaClient();
prisma.user.findMany().then((users) => {
  console.log(JSON.stringify({ prismaUsers: users }));
});
