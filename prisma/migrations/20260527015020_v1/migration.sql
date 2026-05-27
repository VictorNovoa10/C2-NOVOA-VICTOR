-- CreateTable
CREATE TABLE "Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "fechaHora" DATETIME NOT NULL,
    "lugar" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "valor" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventoId" INTEGER NOT NULL,
    CONSTRAINT "Inscripcion_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Evento_fechaHora_idx" ON "Evento"("fechaHora");

-- CreateIndex
CREATE INDEX "Inscripcion_eventoId_idx" ON "Inscripcion"("eventoId");
