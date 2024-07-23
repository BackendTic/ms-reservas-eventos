-- CreateTable
CREATE TABLE "Noticias" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "imagen" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Noticias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Informacion" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "imagen" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Informacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Representantes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "imagen" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Representantes_pkey" PRIMARY KEY ("id")
);
