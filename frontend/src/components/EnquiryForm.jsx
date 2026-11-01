import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, LoaderCircle, CircleCheck, CircleAlert, Info } from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { isApiEnabled, isWhatsAppConfigured, formatPrice } from '../config/siteConfig.js';
import { api } from '../services/api.js';
import { whatsappLink, enquiryToWhatsAppMessage } from '../services/whatsapp.js';
import { validateEnquiry, todayISO } from '../services/validation.js';

const empty = {
  fullName: '', phone: '', email: '', eventType: '', eventDate: '', location: '',
  guests: '', budget: '', requirements: '', packageSlug: '', website: '', // website = honeypot
};

export default function EnquiryForm() {
  const { services, packages } = useContent();
  const [params] = useSearchParams();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  // status: idle | submitting | sent (saved on server) | whatsapp (opened WA) | error
  const [status, setStatus] = useState('idle');
  const [serverMsg, setServerMsg] = useState('');
  const [reference, setReference] = useState(null);
  const formRef = useRef(null);
  const resultRef = useRef(null);

  const eventOptions = useMemo(
    () => [...services.map((s) => ({ value: s.slug, label: s.title })), { value: 'other', label: 'Other' }],
    [services]
  );

  // Pre-fill from links like /contact?event=birthday-parties or ?package=mini-moments
  useEffect(() => {
    const ev = params.get('event');
    const pk = params.get('package');
    setValues((v) => ({
      ...v,
      eventType: ev && eventOptions.some((o) => o.value === ev) ? ev : v.eventType,
      packageSlug: pk && packages.some((p) => p.slug === pk) ? pk : v.packageSlug,
    }));
  }, [params, eventOptions, packages]);

  const selectedPackage = packages.find((p) => p.slug === values.packageSlug);
  const eventLabel = eventOptions.find((o) => o.value === values.eventType)?.label;
  const apiMode = isApiEnabled();

  const onChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) setErrors(validateEnquiry(next));
  };

  const onBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validateEnquiry(values));
  };

  const focusFirstError = (errs) => {
    const first = Object.keys(errs)[0];
    formRef.current?.querySelector(`[name="${first}"]`)?.focus();
  };

  const sendViaWhatsApp = () => {
    const msg = enquiryToWhatsAppMessage({ ...values, packageName: selectedPackage?.name }, eventLabel);
    window.open(whatsappLink(msg), '_blank', 'noopener,noreferrer');
    setStatus('whatsapp');
    setTimeout(() => resultRef.current?.focus(), 50);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validateEnquiry(values);
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(empty).map((k) => [k, true])));
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }
    if (values.website) return; // bot

    if (!apiMode) {
      sendViaWhatsApp();
      return;
    }

    setStatus('submitting');
    setServerMsg('');
    try {
      const res = await api.submitEnquiry({
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        eventType: eventLabel || values.eventType,
        eventDate: values.eventDate,
        location: values.location.trim(),
        guests: Number(values.guests),
        budget: Number(values.budget),
        requirements: values.requirements.trim(),
        packageName: selectedPackage?.name || null,
        website: values.website,
      });
      setReference(res?.id ?? null);
      setStatus('sent');
      setValues(empty);
      setTouched({});
      setTimeout(() => resultRef.current?.focus(), 50);
    } catch (err) {
      if (err.details && typeof err.details === 'object') {
        setErrors(err.details);
        focusFirstError(err.details);
      }
      setServerMsg(err.message);
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="form-result form-result--success" tabIndex={-1} ref={resultRef} role="status">
        <CircleCheck size={44} aria-hidden="true" />
        <h3>Thank you – your enquiry has been received.</h3>
        <p>
          {reference && <>Your reference number is <strong>#{reference}</strong>. </>}
          Our team will review your requirements and get in touch with you shortly to discuss your
          celebration. Please note this is an enquiry, not a confirmed booking – we will share a
          quotation first.
        </p>
        <button type="button" className="btn btn--outline" onClick={() => setStatus('idle')}>
          Send another enquiry
        </button>
      </div>
    );
  }

  const field = (name) => ({
    id: `enq-${name}`,
    name,
    value: values[name],
    onChange,
    onBlur,
    'aria-invalid': Boolean(touched[name] && errors[name]),
    'aria-describedby': touched[name] && errors[name] ? `enq-${name}-error` : undefined,
  });

  const Err = ({ name }) =>
    touched[name] && errors[name] ? (
      <span className="field__error" id={`enq-${name}-error`}>
        <CircleAlert size={14} aria-hidden="true" /> {errors[name]}
      </span>
    ) : null;

  return (
    <form className="enquiry-form" onSubmit={onSubmit} noValidate ref={formRef}>
      {status === 'whatsapp' && (
        <div className="form-alert form-alert--info" tabIndex={-1} ref={resultRef} role="status">
          <WhatsAppIcon size={22} />
          <div>
            <strong>Almost done – please send the message in WhatsApp.</strong>
            <p>
              We opened WhatsApp with your enquiry details pre-filled. Your enquiry reaches us only
              after you tap <em>Send</em> in WhatsApp. If WhatsApp did not open,{' '}
              <button type="button" className="link-btn" onClick={sendViaWhatsApp}>try again</button>.
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="form-alert form-alert--error" role="alert">
          <CircleAlert size={22} aria-hidden="true" />
          <div>
            <strong>Your enquiry was not sent.</strong>
            <p>
              {serverMsg || 'Something went wrong.'} You can try again, or{' '}
              <button type="button" className="link-btn" onClick={sendViaWhatsApp}>send it via WhatsApp</button>{' '}
              instead.
            </p>
          </div>
        </div>
      )}

      {selectedPackage && (
        <div className="form-package">
          <span>Interested package:</span>
          <strong>{selectedPackage.name}</strong>
          <span className="form-package__price">from {formatPrice(selectedPackage.price)}</span>
          <button type="button" className="link-btn" onClick={() => setValues((v) => ({ ...v, packageSlug: '' }))}>
            Remove
          </button>
        </div>
      )}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="enq-fullName">Full Name <span aria-hidden="true">*</span></label>
          <input type="text" autoComplete="name" placeholder="Your full name" required {...field('fullName')} />
          <Err name="fullName" />
        </div>
        <div className="field">
          <label htmlFor="enq-phone">Phone Number <span aria-hidden="true">*</span></label>
          <input type="tel" autoComplete="tel" inputMode="tel" placeholder="10-digit mobile number" required {...field('phone')} />
          <Err name="phone" />
        </div>
        <div className="field">
          <label htmlFor="enq-email">Email Address <span aria-hidden="true">*</span></label>
          <input type="email" autoComplete="email" placeholder="you@example.com" required {...field('email')} />
          <Err name="email" />
        </div>
        <div className="field">
          <label htmlFor="enq-eventType">Event Type <span aria-hidden="true">*</span></label>
          <select required {...field('eventType')}>
            <option value="">Select an event type</option>
            {eventOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <Err name="eventType" />
        </div>
        <div className="field">
          <label htmlFor="enq-eventDate">Event Date <span aria-hidden="true">*</span></label>
          <input type="date" min={todayISO()} required {...field('eventDate')} />
          <Err name="eventDate" />
        </div>
        <div className="field">
          <label htmlFor="enq-location">Event Location <span aria-hidden="true">*</span></label>
          <input type="text" placeholder="Area / venue in Bengaluru" required {...field('location')} />
          <Err name="location" />
        </div>
        <div className="field">
          <label htmlFor="enq-guests">Number of Guests <span aria-hidden="true">*</span></label>
          <input type="number" min="1" max="5000" step="1" inputMode="numeric" placeholder="e.g. 40" required {...field('guests')} />
          <Err name="guests" />
        </div>
        <div className="field">
          <label htmlFor="enq-budget">Budget (₹) <span aria-hidden="true">*</span></label>
          <input type="number" min="1000" step="500" inputMode="numeric" placeholder="e.g. 15000" required {...field('budget')} />
          <Err name="budget" />
        </div>
        <div className="field field--full">
          <label htmlFor="enq-requirements">Additional Requirements</label>
          <textarea rows="5" placeholder="Theme ideas, colours, timing, vendors you need (cake, photographer, catering)…" {...field('requirements')} />
          <span className="field__hint">{values.requirements.length}/1500</span>
          <Err name="requirements" />
        </div>
        {/* Honeypot – hidden from people, catches simple bots */}
        <div className="hp" aria-hidden="true">
          <label htmlFor="enq-website">Website</label>
          <input id="enq-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
        </div>
      </div>

      <div className="enquiry-form__footer">
        <p className="enquiry-form__note">
          <Info size={16} aria-hidden="true" />
          {apiMode
            ? 'Submitting this form sends an enquiry, not a confirmed booking. We will contact you with a quotation.'
            : isWhatsAppConfigured()
              ? 'Your enquiry will open in WhatsApp, ready to send to our team.'
              : 'Your enquiry will open in WhatsApp, ready to send.'}
        </p>
        <button type="submit" className="btn btn--gold" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <><LoaderCircle size={18} className="spin" aria-hidden="true" /> Sending…</>
          ) : apiMode ? (
            <><Send size={18} aria-hidden="true" /> Submit Enquiry</>
          ) : (
            <><WhatsAppIcon size={18} /> Send Enquiry via WhatsApp</>
          )}
        </button>
      </div>
    </form>
  );
}
