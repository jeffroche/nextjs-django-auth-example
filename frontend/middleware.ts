import { authMiddleware } from '@clerk/nextjs';
import { redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
	publicRoutes: ['/', '/api/webhook'],
	afterAuth(auth, req, evt) {
		// handle users who aren't authenticated
		if (!auth.userId && !auth.isPublicRoute) {
			return redirectToSignIn({ returnBackUrl: req.url });
		}
		// redirect them to organization selection page
		if (auth.userId) {
			//  This is where I should authenticate my user with the Django API.
		}
	}
});

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
