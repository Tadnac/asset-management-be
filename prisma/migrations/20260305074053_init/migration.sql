-- CreateTable
CREATE TABLE "Building" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "img" TEXT
);

-- CreateTable
CREATE TABLE "Floor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "levelNumber" INTEGER NOT NULL,
    "name" TEXT,
    "buildingId" INTEGER NOT NULL,
    CONSTRAINT "Floor_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "floorId" INTEGER NOT NULL,
    CONSTRAINT "Room_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inventoryNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specifications" TEXT,
    "typeId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    CONSTRAINT "Item_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ItemType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
