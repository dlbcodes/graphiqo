import postgres from "postgres";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("Couldn't find db url");
}

const sql = postgres(dbUrl);

async function main() {
  console.log("⏳ Setting up database triggers...");

  try {
    // 1. Create the function to handle new user signups
    // We use "security definer" so it can write to public.profiles even if the user isn't logged in yet.
    await sql`
      create or replace function public.handle_new_user()
      returns trigger
      language plpgsql
      security definer set search_path = public
      as $$
      begin
        insert into public.profiles (id, name, avatar, "subscriptionTier", "updatedAt")
        values (
          new.id,
          coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'),
          new.raw_user_meta_data->>'avatar_url',
          'free',
          now()
        );
        return new;
      end;
      $$;
    `;

    // 2. Attach the trigger to the Supabase Auth table
    await sql`
      drop trigger if exists on_auth_user_created on auth.users;
    `;

    await sql`
      create trigger on_auth_user_created
        after insert on auth.users
        for each row execute procedure public.handle_new_user();
    `;

    console.log("✅ Successfully created 'handle_new_user' trigger.");

    // NOTE: We do NOT add a delete trigger here. 
    // Your Prisma schema handles "onDelete: Cascade", which means 
    // if you delete a User in the Supabase Auth dashboard, the Profile 
    // and all their Charts will be deleted automatically.

  } catch (error) {
    console.error("❌ Error setting up triggers:", error);
  } finally {
    await sql.end();
    process.exit();
  }
}

main();