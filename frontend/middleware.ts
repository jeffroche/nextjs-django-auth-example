import { authMiddleware } from '@clerk/nextjs';
import { redirectToSignIn } from '@clerk/nextjs';

export default authMiddleware({
	publicRoutes: ['/', '/api/webhook'],
	afterAuth(auth, req, evt) {
		// handle users who aren't authenticated
		if (!auth.userId && !auth.isPublicRoute) {
			return redirectToSignIn({ returnBackUrl: req.url });
		}
		// redirect them to organization selection page
	}
});

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
