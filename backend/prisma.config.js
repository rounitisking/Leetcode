/*
hamne yaah pr ye file islye d kiya hai kyuki mera prisma envfileko read nhi kr raha tha jiske vajah se usse url nhi mil raha tha 

import "dotenv/config";
you told Prisma to load the .env file manually before doing anything else.

Earlier, Prisma (from version 6+) stopped automatically reading .env, so it couldn’t find DATABASE_URL.
After you imported dotenv/config, it started reading .env again — that’s why the error disappeared ✅*/


import "dotenv/config";
export default {
  schema: "./prisma/schema.prisma",
};


