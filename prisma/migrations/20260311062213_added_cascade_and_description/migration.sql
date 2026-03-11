-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Floor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "levelNumber" INTEGER NOT NULL,
    "name" TEXT,
    "buildingId" INTEGER NOT NULL,
    CONSTRAINT "Floor_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Floor" ("buildingId", "id", "levelNumber", "name") SELECT "buildingId", "id", "levelNumber", "name" FROM "Floor";
DROP TABLE "Floor";
ALTER TABLE "new_Floor" RENAME TO "Floor";
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inventoryNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specifications" TEXT,
    "typeId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    CONSTRAINT "Item_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ItemType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("id", "inventoryNumber", "name", "roomId", "specifications", "typeId") SELECT "id", "inventoryNumber", "name", "roomId", "specifications", "typeId" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "floorId" INTEGER NOT NULL,
    CONSTRAINT "Room_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("floorId", "id", "name") SELECT "floorId", "id", "name" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
