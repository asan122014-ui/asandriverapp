import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

/* =========================================================
   ADMIN ACCOUNTS
========================================================= */

const admins = [
  {
    email: "saiakshith1415@gmail.com",
    password: "Saiakshith@141567",
    role: "superadmin",
  },
  {
    email: "abhilash.kgrc@gmail.com",
    password: "8309649713",
    role: "superadmin",
  },
  {
    email: "bhattagiri.neeharika@gmail.com",
    password: "Neeharika@2036",
    role: "reviewer",
  },
  {
    email: "sharath9291@gmail.com",
    password: "Sharath@0616",
    role: "reviewer",
  },
  {
    email: "ramyapantham7354@gmail.com",
    password: "9030037354",
    role: "reviewer",
  },
];

/* =========================================================
   SEED ADMINS
========================================================= */

const seedAdmins = async () => {
  try {
    /* =====================================================
       CHECK MONGO URI
    ===================================================== */

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from your .env file."
      );
    }

    /* =====================================================
       CONNECT TO MONGODB
    ===================================================== */

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully."
    );

    console.log(
      "Database:",
      mongoose.connection.name
    );

    /* =====================================================
       ADMIN COLLECTION
    ===================================================== */

    const adminCollection =
      mongoose.connection.db.collection(
        "admins"
      );

    /* =====================================================
       REMOVE OLD USERNAME INDEX
    ===================================================== */

    const indexes =
      await adminCollection.indexes();

    const usernameIndex =
      indexes.find(
        (index) =>
          index.name ===
          "username_1"
      );

    if (usernameIndex) {
      await adminCollection.dropIndex(
        "username_1"
      );

      console.log(
        "Removed obsolete username_1 index."
      );
    } else {
      console.log(
        "No old username index found."
      );
    }

    /* =====================================================
       CREATE EMAIL UNIQUE INDEX
    ===================================================== */

    const updatedIndexes =
      await adminCollection.indexes();

    const emailIndex =
      updatedIndexes.find(
        (index) =>
          index.name ===
          "email_1"
      );

    if (!emailIndex) {
      await adminCollection.createIndex(
        {
          email: 1,
        },
        {
          unique: true,
          name: "email_1",
        }
      );

      console.log(
        "Created unique email index."
      );
    }

    /* =====================================================
       CREATE / UPDATE ADMINS
    ===================================================== */

    for (const admin of admins) {
      const email =
        admin.email
          .trim()
          .toLowerCase();

      /* ===================================================
         HASH PASSWORD
      =================================================== */

      const hashedPassword =
        await bcrypt.hash(
          admin.password,
          12
        );

      /* ===================================================
         UPSERT ADMIN
      =================================================== */

      const result =
        await adminCollection.updateOne(
          {
            email,
          },
          {
            $set: {
              email,
              password:
                hashedPassword,
              role:
                admin.role,
              isActive:
                true,
              updatedAt:
                new Date(),
            },

            $setOnInsert: {
              createdAt:
                new Date(),
            },

            /*
              Remove username completely
              from old Admin documents.
            */

            $unset: {
              username: "",
            },
          },
          {
            upsert: true,
          }
        );

      if (
        result.upsertedCount > 0
      ) {
        console.log(
          `Created: ${email} (${admin.role})`
        );
      } else {
        console.log(
          `Updated: ${email} (${admin.role})`
        );
      }
    }

    /* =====================================================
       VERIFY ADMINS
    ===================================================== */

    const savedAdmins =
      await adminCollection
        .find(
          {},
          {
            projection: {
              email: 1,
              role: 1,
              isActive: 1,
              password: 0,
            },
          }
        )
        .toArray();

    console.log(
      "\n===================================="
    );

    console.log(
      "ADMIN ACCOUNTS"
    );

    console.log(
      "===================================="
    );

    savedAdmins.forEach(
      (admin) => {
        console.log(
          `${admin.email} | ${admin.role} | Active: ${admin.isActive}`
        );
      }
    );

    console.log(
      "\nAll Admin accounts seeded successfully."
    );

    /* =====================================================
       CLOSE CONNECTION
    ===================================================== */

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "\nAdmin seed failed:"
    );

    console.error(error);

    try {
      await mongoose.connection.close();
    } catch {
      // Ignore close error
    }

    process.exit(1);
  }
};

/* =========================================================
   RUN
========================================================= */

seedAdmins();