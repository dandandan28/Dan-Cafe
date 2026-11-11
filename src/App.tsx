import { ChangeEvent, FormEvent, useState } from 'react'
import { supabase } from './supabase'

const positions = ['Barista', 'Kitchen', 'Supervisor', 'Manager','Cashier']

function LeafMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 36 36" className="h-9 w-9 fill-none">
      <path
        d="M28.5 7.5c-10.9.4-17.1 5-18.3 13.8 5.5.6 10-1 13.3-4.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M7.5 28.5c4.4-7.2 10.8-12.2 19.2-15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 fill-none">
      <path d="M4 10h12m-4-4 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

export default function App() {
  const [fileName, setFileName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFileName(event.target.files?.[0]?.name ?? '')
  }

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setPhone('')
      return
    }

    let digits = event.target.value.replace(/\D/g, '')
    if (digits.startsWith('63')) digits = digits.slice(2)
    if (digits.startsWith('0')) digits = digits.slice(1)

    const localNumber = digits.slice(0, 10)
    const groups = [localNumber.slice(0, 3), localNumber.slice(3, 6), localNumber.slice(6, 10)].filter(Boolean)
    setPhone(`+63 ${groups.join(' ')}`)
  }
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const form = event.currentTarget
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const data = new FormData(form)
  setSubmitting(true)
  setErrorMessage('')

  const { error: insertError } = await supabase.from('applicants').insert({
    full_name: String(data.get('name') ?? '').trim(),
    email: String(data.get('email') ?? '').trim(),
    phone,
    position: String(data.get('position') ?? ''),
    availability: data.getAll('availability').map(String),
    why_dan_cafe: String(data.get('message') ?? '').trim(),
  })

  setSubmitting(false)

  if (insertError) {
    console.error(insertError)
    setErrorMessage('Something went wrong while sending your application. Please try again.')
    return
  }

  form.reset()
  setPhone('')
  setFileName('')
  setSubmitted(true)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#24362b]">
      <div className="grid min-h-screen lg:grid-cols-[42%_58%]">
        <section className="dan-cafe-panel relative min-h-[440px] overflow-hidden text-white lg:sticky lg:top-0 lg:h-screen">
          <div aria-hidden="true" className="absolute -right-32 -top-36 h-96 w-96 rounded-full border border-[#e3b879]/15" />
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#e3b879]/10" />
          <div aria-hidden="true" className="absolute bottom-[12%] right-[8%] h-16 w-10 rotate-[28deg] rounded-[50%] border border-[#e9cda4]/15">
            <span className="absolute left-1/2 top-2 h-12 w-px -translate-x-1/2 rotate-[18deg] bg-[#e9cda4]/15" />
          </div>

          <div className="relative flex h-full min-h-[440px] flex-col justify-between p-7 sm:p-10 lg:p-12">
            <a href="#" className="flex w-fit items-center gap-2.5 text-white" aria-label="DAN CAFE home">
              <LeafMark />
              <span className="font-serif text-[27px] tracking-tight">DAN CAFE</span>
            </a>

            <div className="max-w-[520px] pt-20">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#e9cda4]">We&apos;re hiring</p>
              <h1 className="font-serif text-[42px] leading-[1.02] tracking-[-0.035em] sm:text-[56px] lg:text-[64px]">
                Good coffee.
                <br />
                Good people.
              </h1>
              <p className="mt-6 max-w-md text-[15px] leading-7 text-white/75 sm:text-base">
                We&apos;re building a thoughtful neighborhood cafe where craft, care, and community come first.
              </p>
              <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-white/65">
                <span className="h-px w-9 bg-[#e9cda4]" />
                Marulas, Valenzuela City, Philippines
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center px-6 py-14 sm:px-10 lg:px-[9%] lg:py-20 xl:px-[12%]">
          <div className="mx-auto w-full max-w-[700px]">
            {submitted ? (
              <div className="animate-in">
                <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#dce7dc] text-[#365744]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-none">
                    <path d="m5 12.5 4.2 4L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  </svg>
                </div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#a0603c]">Application received</p>
                <h2 className="max-w-xl font-serif text-5xl leading-[1.08] tracking-[-0.03em] text-[#203729] sm:text-6xl">
                  Thanks for reaching out.
                </h2>
                <p className="mt-7 max-w-lg text-base leading-7 text-[#607065]">
                  We&apos;ll take a careful look at your application and get back to you within five business days.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-10 border-b border-[#314d3b] pb-1 text-sm font-semibold text-[#314d3b] transition-colors hover:border-[#a0603c] hover:text-[#a0603c]"
                >
                  Send another application
                </button>
              </div>
            ) : (
              <>
                <div className="mb-10 border-b border-[#d8d2c7] pb-9 sm:mb-12">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#a0603c]">Join our team</p>
                  <h2 className="font-serif text-[42px] leading-none tracking-[-0.035em] text-[#203729] sm:text-[52px]">Tell us about yourself.</h2>
                  <p className="mt-5 max-w-xl text-[15px] leading-6 text-[#68736b]">
                    No perfect resume required. We care most about your curiosity, kindness, and appetite to learn.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="field-label">
                      Full name
                      <input
                    required
                    name="name"
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    pattern="[\p{L}\s.'’\-]+"
                    title="Letters only. Numbers are not allowed."
                    placeholder="Your name"
                    onInput={(event) => {
                      event.currentTarget.value = event.currentTarget.value.replace(/[^\p{L}\s.'’-]/gu, '')
                    }}
                    className="field-input"
                  />
                    </label>
                    <label className="field-label">
                      Email address
                      <input required type="email" name="email" autoComplete="email" placeholder="you@email.com" className="field-input" />
                    </label>
                  </div>

                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="field-label">
                      Phone number
                      <input
                        required
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        inputMode="tel"
                        maxLength={17}
                        pattern="[+]63[ ]?9[0-9]{2}[ ]?[0-9]{3}[ ]?[0-9]{4}"
                        title="Enter a Philippine mobile number in the format +63 9XX XXX XXXX"
                        placeholder="+63 9XX XXX XXXX"
                        value={phone}
                        onFocus={() => {
                          if (!phone) setPhone('+63 ')
                        }}
                        onBlur={() => {
                          if (phone === '+63 ') setPhone('')
                        }}
                        onChange={handlePhoneChange}
                        className="field-input"
                      />
                    </label>
                    <label className="field-label">
                      Position
                      <span className="relative block">
                        <select required name="position" defaultValue="" className="field-input appearance-none pr-8">
                          <option value="" disabled>
                            Select a role
                          </option>
                          {positions.map((position) => (
                            <option key={position}>{position}</option>
                          ))}
                        </select>
                        <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute bottom-3.5 right-0 h-4 w-4 fill-none">
                          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </label>
                  </div>

                  <fieldset>
                    <legend className="field-label mb-3">Availability</legend>
                    <div className="flex flex-wrap gap-2.5">
                      {['Weekdays', 'Weekends', 'Mornings', 'Evenings'].map((time) => (
                        <label key={time} className="choice-pill">
                          <input type="checkbox" name="availability" value={time} className="peer sr-only" />
                          <span className="block rounded-full border border-[#cbc7bd] px-4 py-2.5 text-sm font-medium text-[#68736b] transition peer-checked:border-[#365744] peer-checked:bg-[#365744] peer-checked:text-white hover:border-[#748479]">
                            {time}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label className="field-label">
                    Why DAN CAFE?
                    <textarea
                      required
                      name="message"
                      rows={4}
                      placeholder="Share a little about yourself and what draws you to café work..."
                      className="field-input resize-y leading-6"
                    />
                  </label>

                  <div>
                    <p className="field-label mb-3">REsumE <span className="font-normal normal-case tracking-normal text-[#8d968f]">(optional)</span></p>
                    <label className="group flex cursor-pointer items-center justify-between gap-4 rounded-sm border border-dashed border-[#bdb8ad] px-5 py-4 transition hover:border-[#365744] hover:bg-white/40">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[#344b3b]">{fileName || 'Upload a PDF or document'}</span>
                        <span className="mt-1 block text-xs text-[#8a918c]">{fileName ? 'Ready to submit' : 'Up to 10 MB'}</span>
                      </span>
                      <span className="shrink-0 rounded-full border border-[#bdb8ad] px-3.5 py-2 text-xs font-semibold text-[#344b3b] transition group-hover:border-[#365744]">
                        Browse
                      </span>
                      <input type="file" name="resume" accept=".pdf,.doc,.docx" className="sr-only" onChange={handleFileChange} />
                    </label>
                  </div>

                  <div className="flex flex-col gap-5 border-t border-[#d8d2c7] pt-7 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xs text-xs leading-5 text-[#879088]">
                      By applying, you agree that we may contact you about this role.
                    </p>
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-4 rounded-full bg-[#294535] px-7 py-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(41,69,53,.16)] transition hover:-translate-y-0.5 hover:bg-[#1e3729] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#294535]"
                    >
                      Submit application
                      <ArrowIcon />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

