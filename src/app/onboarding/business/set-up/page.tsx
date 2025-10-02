// app/onboarding/business/set-up/page.tsx
import { createClientRSC } from '@/../utils/supabase/server'
import { redirect } from 'next/navigation'
import Button from "../../../components/Button";
import { Progress } from "@/components/ui/progress"

export default async function Setup() {
  const supabase = await createClientRSC()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/onboarding/business/set-up')
  const userId = user.id as string

  // Prefill draft
  const { data: draft } = await supabase
    .from('business_listings')
    .select('id, title, industry, county, location_city, contact_email, listing_image_path')
    .eq('owner_id', userId)
    .eq('status', 'draft')
    .maybeSingle()

  // Signed preview (private bucket)
  let coverPreviewUrl: string | null = null
  if (draft?.listing_image_path) {
    const { data: signed } = await supabase.storage
      .from('listings')
      .createSignedUrl(draft.listing_image_path, 60)
    coverPreviewUrl = signed?.signedUrl ?? null
  }

  async function save(formData: FormData) {
    'use server'
    const { createClientRSC } = await import('@/../utils/supabase/server')
    const sb = await createClientRSC()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) redirect('/login?next=/onboarding/business/set-up')

    const title    = String(formData.get('title') ?? '').trim()
    const industry = String(formData.get('industry') ?? '').trim()
    const county   = String(formData.get('county') ?? '').trim()
    const city     = String(formData.get('city') ?? '').trim()

    const payload = {
      owner_id: user.id,
      status: 'draft' as const,
      title,
      industry,
      county,
      location_city: city || null,
      contact_email: user.email ?? null,
    }

    // Ensure we have a listing id
    let listingId = draft?.id as string | undefined
    if (!listingId) {
      const { data: ins, error: insErr } = await sb
        .from('business_listings')
        .insert(payload)
        .select('id')
        .single()
      if (insErr) {
        console.error(insErr)
        return
      }
      listingId = ins!.id
    } else {
      const { error: updErr } = await sb
        .from('business_listings')
        .update(payload)
        .eq('id', listingId)
      if (updErr) {
        console.error(updErr)
        return
      }
    }

    // Handle file upload
    const file = formData.get('cover') as File | null

    if (file && file.size > 0 && listingId) {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const key = `${user.id}/${listingId}/cover.${ext}` // bucket-relative path

      const { error: upErr } = await sb.storage
        .from('listings')                 // <— your bucket name
        .upload(key, file, {
          upsert: true,                   // allow replace
          contentType: file.type || 'image/jpeg',
          cacheControl: '3600',
        })

    if (upErr) {
      console.error('Storage upload failed:', upErr) // <— check your server logs
      // Optionally return an error UI instead of continuing
      return
    }

    // Save the path in Postgres so you can render later
    const { error: updImgErr } = await sb
      .from('business_listings')
      .update({ listing_image_path: key })
      .eq('id', listingId)

    if (updImgErr) {
      console.error('DB update (listing_image_path) failed:', updImgErr)
      return
    }
  }

      redirect('/onboarding/business/contact')
    }

  return (
    <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-center min-h-screen justify-center">
      <div className='mx-auto max-w-lg lg:min-w-[500px]'>
        <p className='mb-2'> Profile 0% Complete</p>
        <Progress value={0} />
      </div>

    <div className=" bg-white mx-auto max-w-lg lg:min-w-[500px] p-6 my-5 rounded-xl border border-neutral-200 shadow">
    <form action={save} >
      <h1 className="text-2xl font-semibold">Business Basics</h1>

      <label className="block pt-4 pt-4">
        <span>Business Title</span>
        <input
          name="title"
          defaultValue={draft?.title ?? ''}
          required
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </label>

      <label className="block pt-4">
        <span>Industry</span>
        <select
          name="industry"
          required
          defaultValue={draft?.industry ?? ''}
          className="mt-1 w-full border rounded px-3 py-2 hover:cursor-pointer"
        >
          <option value="" disabled>Choose an industry…</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Retail">Retail</option>
          <option value="Hospitality">Hospitality</option>
          <option value="Construction">Construction</option>
          <option value="Professional_services">Professional Services</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Real_estate">Real Estate</option>
          <option value="Transportation_logistics">Transportation & Logistics</option>
          <option value="Technology">Technology</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label className="block pt-4">
        <span>County</span>
        <select
          name="county"
          required
          defaultValue={draft?.county ?? ''}
          className="mt-1 w-full border rounded px-3 py-2 hover:cursor-pointer"
        >
          <option value="" disabled>Choose a county</option>
          <option value="Hidalgo County">Hidalgo</option>
          <option value="Cameron County">Cameron</option>
          <option value="Starr County">Starr</option>
          <option value="Willacy County">Willacy</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block pt-4">
          <span>City</span>
          <input
            name="city"
            defaultValue={draft?.location_city ?? ''}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
      </div>

      <label className="block pt-4">
        <span>Listing Image</span>
        <input name="cover" type="file" accept="image/*" className="mt-1 w-full border rounded border-neutral-200 px-3 py-2 hover:cursor-pointer" />
        {coverPreviewUrl && (
          <img
            src={coverPreviewUrl}
            alt="Listing cover"
            className="mt-2 h-40 w-full object-cover rounded hover:cursor-pointer"
          />
        )}
      </label>
      <div className="mt-4 flex gap-3">
        <Button className="w-full">Save & Continue</Button>
      </div>
    </form>
    </div>

    </div>
  )
}
