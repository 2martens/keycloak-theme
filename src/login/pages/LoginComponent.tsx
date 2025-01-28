import { I18n } from "../i18n";
import { KcContext } from "../KcContext";
import { useEffect, useState } from "react";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Button, Checkbox, Field, Input, Label, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { clsx } from "keycloakify/tools/clsx";
import {
    ArrowRightEndOnRectangleIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    EyeSlashIcon,
    InformationCircleIcon,
    KeyIcon,
    UserIcon
} from "@heroicons/react/24/solid";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useSetClassName } from "keycloakify/tools/useSetClassName";

export default function LoginComponent(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n> & TemplateProps<KcContext, I18n>) {
    const { displayMessage = true, displayRequiredFields = false, bodyClassName, documentTitle, kcContext, i18n, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss: true,
        classes
    });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;
    const { social, realm, url, message, isAppInitiatedAction, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [isRememberMeChecked, setIsRememberMeChecked] = useState(!!login.rememberMe);

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss: false });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <>
            {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <header className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">{realm.displayName}</h1>

                    {enabledLanguages.length > 1 && (
                        <div className={clsx("float-right", kcClsx("kcLocaleMainClass"))} id="kc-locale">
                            <div id="kc-locale-wrapper" className={kcClsx("kcLocaleWrapperClass")}>
                                <Menu>
                                    <MenuButton
                                        tabIndex={1}
                                        id="kc-current-locale-link"
                                        aria-label={msgStr("languages")}
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        aria-controls="language-switch1"
                                        className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                    >
                                        {currentLanguage.label}
                                    </MenuButton>
                                    <MenuItems
                                        aria-labelledby="kc-current-locale-link"
                                        aria-activedescendant=""
                                        id="language-switch1"
                                        className="w-52 origin-top-right rounded-xl border border-black/5 bg-black/70 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                        anchor="bottom"
                                    >
                                        {enabledLanguages.map(({ languageTag, label, href }, i) => (
                                            <MenuItem key={languageTag}>
                                                <a
                                                    role="menuitem"
                                                    id={`language-${i + 1}`}
                                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/95"
                                                    href={href}
                                                >
                                                    {label}
                                                </a>
                                            </MenuItem>
                                        ))}
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>
                    )}
                    <div className="mt-10 flex">
                        {(() => {
                            const node = (
                                <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900" id="kc-page-title">
                                    {!(auth !== undefined && auth.showUsername && !auth.showResetCredentials)
                                        ? msg("loginAccountTitle")
                                        : auth.attemptedUsername}
                                </h2>
                            );
                            if (displayRequiredFields) {
                                return (
                                    <div className={kcClsx("kcContentWrapperClass")}>
                                        <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                            <span className="subtitle">
                                                <span className="required">*</span>
                                                {msg("requiredFields")}
                                            </span>
                                        </div>
                                        <div className="col-md-10">{node}</div>
                                    </div>
                                );
                            }

                            return node;
                        })()}

                        {auth !== undefined && auth.showUsername && !auth.showResetCredentials && (
                            <a href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")} title={msgStr("restartLoginTooltip")}>
                                <ArrowRightEndOnRectangleIcon
                                    aria-hidden="true"
                                    className="size-5 self-center justify-self-start text-blue-500 sm:size-4"
                                ></ArrowRightEndOnRectangleIcon>
                            </a>
                        )}
                    </div>
                </header>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <div
                            className={clsx(
                                "grid grid-cols-1 grow",
                                `alert-${message.type}`,
                                kcClsx("kcAlertClass"),
                                `pf-m-${message?.type === "error" ? "danger" : message.type}`
                            )}
                        >
                            {message.type === "success" && (
                                <CheckCircleIcon
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 mr-3 size-10 self-center justify-self-start text-green-500 sm:size-4"
                                />
                            )}
                            {message.type === "warning" && (
                                <ExclamationTriangleIcon
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 mr-3 size-10 self-center justify-self-start text-yellow-500 sm:size-4"
                                />
                            )}
                            {message.type === "error" && (
                                <ExclamationCircleIcon
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 mr-3 size-10 self-center justify-self-start text-red-500 sm:size-4"
                                />
                            )}
                            {message.type === "info" && (
                                <InformationCircleIcon
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 mr-3 size-10 self-center justify-self-start text-blue-500 sm:size-4"
                                />
                            )}

                            <span
                                className={clsx(
                                    message.type === "error" && "text-red-600",
                                    message.type === "warning" && "text-yellow-600",
                                    message.type === "info" && "text-blue-600",
                                    message.type === "success" && "text-green-600",
                                    "col-start-1 row-start-1 block w-full text-sm pl-10"
                                )}
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(message.summary)
                                }}
                            />
                        </div>
                    )}
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            action={url.loginAction}
                            method="POST"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                        >
                            <div>
                                {!usernameHidden && (
                                    <Field>
                                        <Label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                            {!realm.loginWithEmailAllowed
                                                ? msg("username")
                                                : !realm.registrationEmailAsUsername
                                                  ? msg("usernameOrEmail")
                                                  : msg("email")}
                                        </Label>
                                        <div className="mt-2 mr-px grid grow grid-cols-1 focus-within:relative">
                                            <Input
                                                tabIndex={2}
                                                id="username"
                                                disabled={auth !== undefined && auth.showUsername && !auth.showResetCredentials}
                                                className={clsx(
                                                    "data-[disabled]:cursor-not-allowed data-[disabled]:bg-gray-50 data-[disabled]:text-gray-500 data-[disabled]:outline-gray-200",
                                                    messagesPerField.existsError("username", "password") &&
                                                        "outline-red-300 placeholder:text-red-300 focus:outline-red-600",
                                                    "col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 px-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600  sm:pl-9 sm:text-sm/6"
                                                )}
                                                name="username"
                                                defaultValue={login.username ?? auth.attemptedUsername ?? ""}
                                                type="text"
                                                autoFocus
                                                autoComplete="username"
                                                aria-invalid={messagesPerField.existsError("username", "password")}
                                            />
                                            {messagesPerField.existsError("username", "password") && (
                                                <ExclamationCircleIcon
                                                    aria-hidden="true"
                                                    className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
                                                />
                                            )}
                                            <UserIcon
                                                aria-hidden="true"
                                                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
                                            ></UserIcon>
                                        </div>
                                        {messagesPerField.existsError("username", "password") && (
                                            <span
                                                id="input-error"
                                                className="mt-2 text-sm text-red-600"
                                                aria-live="polite"
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                }}
                                            />
                                        )}
                                    </Field>
                                )}
                                <Field className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                            {msg("password")}
                                        </Label>
                                        {realm.resetPasswordAllowed && (
                                            <div className="text-sm/6">
                                                <a
                                                    tabIndex={6}
                                                    href={url.loginResetCredentialsUrl}
                                                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                                                >
                                                    {msg("doForgotPassword")}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <div className="grid grid-cols-1">
                                            <PasswordWrapper i18n={i18n} passwordInputId="password">
                                                <Input
                                                    tabIndex={3}
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    required
                                                    autoComplete="current-password"
                                                    aria-invalid={messagesPerField.existsError("username", "password")}
                                                    className="col-start-1 row-start-1 block w-full rounded-l-md bg-white py-1.5 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6"
                                                />
                                                <KeyIcon
                                                    aria-hidden="true"
                                                    className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
                                                ></KeyIcon>
                                            </PasswordWrapper>
                                        </div>

                                        {usernameHidden && messagesPerField.existsError("username", "password") && (
                                            <span
                                                id="input-error"
                                                className="mt-2 text-sm text-red-600"
                                                aria-live="polite"
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                }}
                                            />
                                        )}
                                    </div>
                                </Field>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                                {realm.rememberMe && !usernameHidden && (
                                    <Field className="flex gap-3">
                                        <div className="flex h-6 shrink-0 items-center">
                                            <div tabIndex={5}>
                                                <Checkbox
                                                    id="rememberMe"
                                                    name="rememberMe"
                                                    checked={isRememberMeChecked}
                                                    onChange={setIsRememberMeChecked}
                                                    className="group block size-4 rounded-sm border border-gray-300 bg-white data-[checked]:border-indigo-600 data-[checked]:bg-indigo-600 data-[indeterminate]:border-indigo-600 data-[indeterminate]:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[disabled]:border-gray-300 data-[disabled]:bg-gray-100 data-[disabled]:data-[checked]:bg-gray-100 forced-colors:appearance-auto"
                                                >
                                                    <svg
                                                        className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                                                        viewBox="0 0 14 14"
                                                        fill="none"
                                                    >
                                                        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Checkbox>
                                            </div>
                                        </div>
                                        <Label htmlFor="rememberMe" className="block text-sm/6 text-gray-900">
                                            {msg("rememberMe")}
                                        </Label>
                                    </Field>
                                )}
                            </div>

                            <div id="kc-form-buttons" className="mt-3">
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <Button
                                    tabIndex={7}
                                    disabled={isLoginButtonDisabled}
                                    type="submit"
                                    name="login"
                                    id="kc-login"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {msgStr("doLogIn")}
                                </Button>
                            </div>
                        </form>
                    )}
                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                            <div className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" name="tryAnotherWay" value="on" />
                                <a
                                    href="#"
                                    id="try-another-way"
                                    onClick={() => {
                                        document.forms["kc-select-try-another-way-form" as never].submit();
                                        return false;
                                    }}
                                >
                                    {msg("doTryAnotherWay")}
                                </a>
                            </div>
                        </form>
                    )}
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                            <div className="relative mt-10">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm/6 font-medium">
                                    <span className="bg-white px-6 text-gray-900">{msg("identity-provider-login-label")}</span>
                                </div>
                            </div>
                            <div
                                className={clsx(
                                    "mt-6",
                                    social.providers.length > 3 && "grid grid-cols-2 gap-4",
                                    kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")
                                )}
                            >
                                {social.providers.map((...[p, , providers]) => (
                                    <a
                                        key={p.alias}
                                        id={`social-${p.alias}`}
                                        className={clsx(
                                            kcClsx("kcFormSocialAccountListButtonClass", providers.length > 3 && "kcFormSocialAccountGridItem"),
                                            "flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
                                        )}
                                        type="button"
                                        href={p.loginUrl}
                                    >
                                        {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                        <span
                                            className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                            dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                        ></span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    {realm.password && realm.registrationAllowed && !registrationDisabled && (
                        <p className="mt-10 text-center text-sm/6 text-gray-500">
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl} className="font-semibold text-indigo-600 hover:text-indigo-500">
                                {msg("doRegister")}
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

function PasswordWrapper(props: { i18n: I18n; passwordInputId: string; children: JSX.Element[] }) {
    const { i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

    return (
        <div className="mt-2 flex">
            <div className="mr-px grid grow grid-cols-1 focus-within:relative">{children}</div>
            <Button
                type="button"
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls="password"
                onClick={toggleIsPasswordRevealed}
                className="flex shrink-0 items-center gap-x-1.5 rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            >
                {!isPasswordRevealed && <EyeIcon className="size-4 text-gray-400" aria-hidden="true" />}
                {isPasswordRevealed && <EyeSlashIcon className="size-4 text-gray-400" aria-hidden="true" />}
            </Button>
        </div>
    );
}
